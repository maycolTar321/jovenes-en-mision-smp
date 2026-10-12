import { SystemConfig } from '../types';
import { appsScriptService } from './appsScriptService';

// Sal criptográfica idéntica al backend de Google Apps Script
const SECURITY_SALT = 'SMP_TARIJA_2026_CONFIRMACION_SALT_SECURE_KEY';

// Hash SHA-256 precalculado de (SALT + "admin5230") para validación local segura sin exponer la contraseña en texto plano
const INITIAL_ADMIN_HASH = 'c100ba3126b2a9d5b7d4f5b782c720a1a0206b1c22a647fe4de2df8a76095845';

// Claves de sesión con tiempo de vida (12 horas)
const SESSION_TOKEN_KEY = 'smp_admin_token';
const SESSION_EXPIRES_KEY = 'smp_admin_expires';
const SESSION_AUTH_FLAG = 'smp_admin_authenticated';

/**
 * Calcula el hash SHA-256 de una contraseña con la sal del sistema utilizando Web Crypto API
 */
export async function computePasswordHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(SECURITY_SALT + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const authService = {
  /**
   * Autentica la contraseña ingresada.
   * Consulta primero a Google Apps Script si está configurado.
   * Si no hay backend configurado o la red falla, valida contra el hash criptográfico local.
   */
  async verifyPassword(password: string, config: SystemConfig): Promise<{ success: boolean; message?: string }> {
    const cleanPassword = (password || '').trim();
    if (!cleanPassword) {
      return { success: false, message: 'Por favor ingresa la contraseña de acceso.' };
    }

    // 1. Verificación remota prioritaria si hay URL de Google Apps Script
    if (config.appsScriptUrl && config.appsScriptUrl.trim() !== '') {
      try {
        const remoteRes = await appsScriptService.authAdmin(cleanPassword, config);
        if (remoteRes.success && remoteRes.data?.adminToken) {
          const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
          this.setSession(remoteRes.data.adminToken, expiresAt);
          return { success: true };
        } else {
          return { success: false, message: 'Contraseña incorrecta. Acceso denegado.' };
        }
      } catch (err) {
        console.warn('Backend remoto no disponible para auth, procediendo con verificación local segura:', err);
      }
    }

    // 2. Verificación criptográfica local (resiliente, sin guardar texto plano)
    try {
      const inputHash = await computePasswordHash(cleanPassword);
      if (inputHash === INITIAL_ADMIN_HASH) {
        const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
        const localToken = `SMP_LOCAL_${expiresAt}_${inputHash.substring(0, 10)}`;
        this.setSession(localToken, expiresAt);
        return { success: true };
      }
    } catch (hashErr) {
      console.error('Error calculando digest criptográfico:', hashErr);
    }

    return { success: false, message: 'Contraseña incorrecta. Acceso denegado.' };
  },

  /**
   * Verifica si la sesión actual está activa y no ha expirado
   */
  isAuthenticated(): boolean {
    try {
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
      const expiresStr = sessionStorage.getItem(SESSION_EXPIRES_KEY);
      if (!token || !expiresStr) return false;

      const expiresAt = parseInt(expiresStr, 10);
      if (isNaN(expiresAt) || Date.now() > expiresAt) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Guarda los datos de sesión en sessionStorage con timestamp de expiración
   */
  setSession(token: string, expiresAt: number): void {
    try {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      sessionStorage.setItem(SESSION_EXPIRES_KEY, expiresAt.toString());
      sessionStorage.setItem(SESSION_AUTH_FLAG, 'true');
      appsScriptService.setAdminToken(token);
    } catch {}
  },

  /**
   * Cierra la sesión activa y elimina todos los tokens del almacenamiento
   */
  logout(): void {
    try {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      sessionStorage.removeItem(SESSION_EXPIRES_KEY);
      sessionStorage.removeItem(SESSION_AUTH_FLAG);
      appsScriptService.clearAdminToken();
    } catch {}
  }
};
