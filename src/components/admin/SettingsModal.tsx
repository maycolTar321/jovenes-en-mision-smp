import React, { useState } from 'react';
import { SystemConfig } from '../../types';
import { storageService } from '../../services/storageService';
import { appsScriptService, IntegrationTestResult } from '../../services/appsScriptService';
import { 
  Settings, Key, Globe, Shield, RefreshCw, CheckCircle2, AlertCircle, 
  ExternalLink, Save, X, Table, PlayCircle, Layers, Check, Terminal 
} from 'lucide-react';

interface SettingsModalProps {
  config: SystemConfig;
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: (config: SystemConfig) => void;
  onResetData: () => void;
}

const REQUIRED_SHEETS = [
  '1. CONFIGURACION',
  '2. PARTICIPANTES',
  '3. RESPUESTAS',
  '4. RESULTADOS',
  '5. EQUIPOS',
  '6. PROYECTOS',
  '7. ACTIVIDADES',
  '8. AUDITORIA'
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onConfigSaved,
  onResetData
}) => {
  const [formData, setFormData] = useState<SystemConfig>(config);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Estados de inicialización de hojas y prueba E2E
  const [isInitializingSheets, setIsInitializingSheets] = useState<boolean>(false);
  const [sheetsInitResult, setSheetsInitResult] = useState<{ success: boolean; message: string } | null>(null);

  const [isRunningE2ETest, setIsRunningE2ETest] = useState<boolean>(false);
  const [e2eTestReport, setE2eTestReport] = useState<IntegrationTestResult | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await appsScriptService.testConnection(formData.appsScriptUrl);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  const handleInitSheets = async () => {
    setIsInitializingSheets(true);
    setSheetsInitResult(null);
    try {
      const res = await appsScriptService.initSheets(formData, formData.adminPin);
      setSheetsInitResult(res);
    } catch (e: any) {
      setSheetsInitResult({ success: false, message: e.message || 'Error al inicializar las hojas' });
    } finally {
      setIsInitializingSheets(false);
    }
  };

  const handleRunE2ETest = async () => {
    setIsRunningE2ETest(true);
    setE2eTestReport(null);
    try {
      const report = await appsScriptService.runIntegrationTest(formData);
      setE2eTestReport(report);
    } catch (e: any) {
      setE2eTestReport({
        success: false,
        stepPing: false,
        stepWriteTest: false,
        stepReadMetrics: false,
        testSubmissionId: 'error',
        message: e.message || 'Fallo durante la prueba',
        timestamp: new Date().toISOString(),
        diagnostics: [`[ERROR] ${e.message}`]
      });
    } finally {
      setIsRunningE2ETest(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveConfig(formData);
    onConfigSaved(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas restaurar los datos iniciales de prueba de Tarija? Se sobrescribirá el padrón con los 6 ejemplos iniciales.')) {
      onResetData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Backend & Google Sheets</h3>
              <p className="text-xs text-stone-500">Parroquia San Martín de Porres — Tarija, Bolivia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* 1. Conexión con Apps Script */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                URL del Web App de Google Apps Script:
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold">
                Backend v3.0
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={formData.appsScriptUrl}
                onChange={e => setFormData({ ...formData, appsScriptUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-stone-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[11px] text-stone-500">
                  Script: <code className="bg-stone-100 px-1 py-0.5 rounded text-neutral-900 font-mono">backend/google-apps-script/Code.gs</code>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={!formData.appsScriptUrl || isTesting}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-800 text-xs font-semibold hover:bg-neutral-100 disabled:opacity-40"
                  >
                    {isTesting ? 'Probando...' : '1. Probar Conexión'}
                  </button>
                  <button
                    type="button"
                    onClick={handleInitSheets}
                    disabled={!formData.appsScriptUrl || isInitializingSheets}
                    className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold hover:bg-amber-100 disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isInitializingSheets ? 'Inicializando...' : '2. Inicializar 8 Hojas'}</span>
                  </button>
                </div>
              </div>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn ${
                testResult.success ? 'bg-neutral-100 text-neutral-900 border border-neutral-300' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                <span>{testResult.message}</span>
              </div>
            )}

            {sheetsInitResult && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn ${
                sheetsInitResult.success ? 'bg-neutral-100 text-neutral-900 border border-neutral-300' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {sheetsInitResult.success ? <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                <span>{sheetsInitResult.message}</span>
              </div>
            )}
          </div>

          {/* 2. Resumen de las 8 Hojas de Google Sheets */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-red-600" />
                Estructura de Base de Datos (8 Hojas de Cálculo):
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Requeridas por Prompt 5</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono font-medium">
              {REQUIRED_SHEETS.map(sheet => (
                <div key={sheet} className="p-1.5 bg-white rounded-lg border border-stone-200 text-stone-800 flex items-center gap-1 truncate" title={sheet}>
                  <Check className="w-3 h-3 text-red-600 shrink-0" />
                  <span className="truncate">{sheet.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Botón de Prueba E2E (Prompt 5 Requisito 6) */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-serif font-bold text-neutral-900 text-sm flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-red-600" />
                  <span>3. Verificación de Integración End-to-End</span>
                </h4>
                <p className="text-xs text-neutral-700 mt-0.5">
                  Envía una fila identificada como prueba a Google Sheets y comprueba que el dashboard la lee sin mezclarla con respuestas reales.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunE2ETest}
                disabled={!formData.appsScriptUrl || isRunningE2ETest}
                className="btn-primary text-xs py-2 px-4 shrink-0 font-bold text-white disabled:opacity-50"
              >
                {isRunningE2ETest ? 'Ejecutando Test...' : 'Ejecutar Test E2E'}
              </button>
            </div>

            {/* Consola de diagnóstico E2E */}
            {e2eTestReport && (
              <div className="p-3 bg-stone-900 rounded-xl text-stone-100 text-xs font-mono space-y-1.5 overflow-x-auto animate-fadeIn">
                <div className="flex items-center justify-between pb-1 border-b border-stone-700 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                    Diagnóstico de Conexión en Vivo
                  </span>
                  <span className={e2eTestReport.success ? 'text-white font-bold' : 'text-red-400 font-bold'}>
                    {e2eTestReport.success ? '✓ VERIFICACIÓN EXITOSA' : '✗ FALLO'}
                  </span>
                </div>
                {e2eTestReport.diagnostics.map((line, idx) => (
                  <div key={idx} className={line.startsWith('[OK]') ? 'text-red-400' : line.startsWith('[ERROR]') ? 'text-red-400' : 'text-stone-300'}>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Seguridad y PIN Administrativo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                PIN de Acceso al Panel Pastoral:
              </label>
              <input
                type="text"
                required
                value={formData.adminPin}
                onChange={e => setFormData({ ...formData, adminPin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono text-stone-900"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Verificado mediante SHA-256 + Sal en Apps Script
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                ID de Google Spreadsheet (Opcional):
              </label>
              <input
                type="text"
                placeholder="1BxiMVs0XRA5nFMd..."
                value={formData.spreadsheetId}
                onChange={e => setFormData({ ...formData, spreadsheetId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono text-stone-900"
              />
            </div>
          </div>

          {/* Zona de Guardado y Restaurar */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1.5 font-medium hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar datos de muestra</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-bold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveSuccess ? '¡Guardado!' : 'Guardar Configuración'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
