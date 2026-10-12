import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { authService, computePasswordHash } from '../authService';
import { DEFAULT_CONFIG } from '../../config/constants';

// Mock storage for Node test environment
class MemoryStorage {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value.toString(); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

describe('authService - Autenticación administrativa discreta y segura', () => {
  beforeAll(() => {
    if (typeof globalThis.sessionStorage === 'undefined') {
      (globalThis as any).sessionStorage = new MemoryStorage();
    }
  });

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('calcula el hash SHA-256 consistente con la sal del sistema', async () => {
    const hash = await computePasswordHash('admin5230');
    expect(hash).toBe('c100ba3126b2a9d5b7d4f5b782c720a1a0206b1c22a647fe4de2df8a76095845');
  });

  it('autentica correctamente con la contraseña autorizada admin5230 en modo local', async () => {
    const localConfig = { ...DEFAULT_CONFIG, appsScriptUrl: '' };
    const res = await authService.verifyPassword('admin5230', localConfig);
    expect(res.success).toBe(true);
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('rechaza contraseñas incorrectas sin revelar la clave', async () => {
    const localConfig = { ...DEFAULT_CONFIG, appsScriptUrl: '' };
    const res = await authService.verifyPassword('claveErronea123', localConfig);
    expect(res.success).toBe(false);
    expect(res.message).toBe('Contraseña incorrecta. Acceso denegado.');
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('rechaza contraseñas vacías', async () => {
    const localConfig = { ...DEFAULT_CONFIG, appsScriptUrl: '' };
    const res = await authService.verifyPassword('   ', localConfig);
    expect(res.success).toBe(false);
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('gestiona la expiración de sesión y logout correctamente', () => {
    const expiresFuture = Date.now() + 3600000;
    authService.setSession('TEST_TOKEN_123', expiresFuture);
    expect(authService.isAuthenticated()).toBe(true);

    // Logout
    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
  });
});
