import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, AlertCircle, X } from 'lucide-react';
import { SystemConfig } from '../../types';
import { authService } from '../../services/authService';

interface AdminAuthModalProps {
  isOpen: boolean;
  config: SystemConfig;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  config,
  onSuccess,
  onClose
}) => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;

    setErrorMessage(null);
    setIsVerifying(true);

    try {
      const result = await authService.verifyPassword(password, config);
      if (result.success) {
        setPassword('');
        onSuccess();
      } else {
        setErrorMessage(result.message || 'Contraseña incorrecta. Acceso denegado.');
      }
    } catch (err) {
      setErrorMessage('Error al comprobar credenciales. Intenta nuevamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    if (!isVerifying) {
      setPassword('');
      setErrorMessage(null);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative"
      >
        {/* Botón cerrar modal */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isVerifying}
          aria-label="Cerrar ventana de acceso"
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 border border-red-100 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6 text-red-600" />
          </div>
          <h3 id="auth-modal-title" className="font-serif font-black text-xl text-neutral-900">
            Acceso restringido
          </h3>
          <p className="text-xs text-stone-500">
            Área de coordinación parroquial. Ingresa tus credenciales autorizadas.
          </p>
        </div>

        {/* Mensaje de error si falla la autenticación */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                disabled={isVerifying}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Ingresa tu clave de acceso"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-600 bg-stone-50/50 disabled:opacity-60"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                className="absolute right-3 top-2.5 p-1 text-stone-400 hover:text-stone-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleClose}
              className="btn-secondary w-1/2 py-2.5 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="btn-primary w-1/2 py-2.5 text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
