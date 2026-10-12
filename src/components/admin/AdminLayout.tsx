import React, { useState, useEffect } from 'react';
import { Participant, MixedTeam, SocialProjectTracking, SystemConfig } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { ParticipantsList } from './ParticipantsList';
import { SkillsAnalysis } from './SkillsAnalysis';
import { TeamFormation } from './TeamFormation';
import { ProjectTracker } from './ProjectTracker';
import { ReportsGenerator } from './ReportsGenerator';
import { SettingsModal } from './SettingsModal';
import { 
  LayoutDashboard, Users, Sparkles, Wand2, ClipboardList, FileDown, Settings, Lock, KeyRound, LogOut, ShieldCheck, Eye, EyeOff 
} from 'lucide-react';
import { authService } from '../../services/authService';

interface AdminLayoutProps {
  participants: Participant[];
  teams: MixedTeam[];
  project: SocialProjectTracking;
  config: SystemConfig;
  onParticipantDeleted: (id: string) => void;
  onTeamsUpdated: (teams: MixedTeam[]) => void;
  onProjectUpdated: (project: SocialProjectTracking) => void;
  onConfigSaved: (config: SystemConfig) => void;
  onResetData: () => void;
  onRefresh: () => void;
  onExitAdmin: () => void;
}

export type AdminTab = 
  | 'dashboard'
  | 'participants'
  | 'skills'
  | 'teams'
  | 'project'
  | 'reports';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  participants,
  teams,
  project,
  config,
  onParticipantDeleted,
  onTeamsUpdated,
  onProjectUpdated,
  onConfigSaved,
  onResetData,
  onRefresh,
  onExitAdmin
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Check session auth
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;
    setIsVerifying(true);
    setPinError(false);

    try {
      const result = await authService.verifyPassword(pinInput, config);
      if (result.success) {
        setIsAuthenticated(true);
        setPinError(false);
      } else {
        setPinError(true);
      }
    } catch {
      setPinError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setPinInput('');
    onExitAdmin();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-stone-200 shadow-elevated text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#E4EEE8] text-[#214C3B] flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8 text-[#214C3B]" />
        </div>

        <div>
          <h2 className="text-2xl font-serif font-black text-neutral-900">Acceso restringido</h2>
          <p className="text-xs text-stone-500 mt-1">
            Área reservada de coordinación pastoral. Ingresa tus credenciales autorizadas.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type={showPin ? 'text' : 'password'}
                required
                disabled={isVerifying}
                placeholder="Ingresa la contraseña"
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-[#303632] focus:outline-none ${
                  pinError ? 'border-[#214C3B] ring-2 ring-[#214C3B]/20' : 'border-[#737B76]/30 focus:ring-2 focus:ring-[#214C3B]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-3 p-0.5 text-stone-400 hover:text-stone-700 transition-colors"
                title={showPin ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPin ? (
                  <EyeOff className="w-4 h-4 text-stone-600" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {pinError && (
              <p className="text-xs text-[#214C3B] mt-1.5 text-left font-medium">
                Contraseña incorrecta. Acceso denegado.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={isVerifying}
              onClick={onExitAdmin}
              className="btn-secondary w-1/2 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isVerifying || !pinInput.trim()}
              className="btn-primary w-1/2 text-xs font-bold flex items-center justify-center gap-1.5"
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

        <p className="text-[11px] text-stone-400">
          Parroquia San Martín de Porres • Tarija
        </p>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard & Métricas', icon: LayoutDashboard },
    { id: 'participants' as AdminTab, label: 'Participantes & Códigos', icon: Users },
    { id: 'skills' as AdminTab, label: 'Análisis de Talentos', icon: Sparkles },
    { id: 'teams' as AdminTab, label: 'Equipos Mixtos', icon: Wand2 },
    { id: 'project' as AdminTab, label: 'Ficha del Proyecto', icon: ClipboardList },
    { id: 'reports' as AdminTab, label: 'Informes & Descargas', icon: FileDown },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Admin Nav Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 shadow-soft p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#214C3B] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-neutral-100 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Configuración de Backend"
            className="p-1.5 sm:p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-[#214C3B]"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            title="Cerrar Sesión Administrativa"
            className="p-2 rounded-xl text-stone-500 hover:bg-[#E4EEE8] hover:text-[#214C3B]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'dashboard' && (
          <AdminDashboard
            participants={participants}
            teams={teams}
            project={project}
            config={config}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === 'participants' && (
          <ParticipantsList
            participants={participants}
            onParticipantDeleted={onParticipantDeleted}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsAnalysis
            participants={participants}
          />
        )}

        {activeTab === 'teams' && (
          <TeamFormation
            participants={participants}
            teams={teams}
            onTeamsUpdated={onTeamsUpdated}
          />
        )}

        {activeTab === 'project' && (
          <ProjectTracker
            project={project}
            onProjectUpdated={onProjectUpdated}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsGenerator
            participants={participants}
            teams={teams}
            project={project}
            onProjectUpdated={onProjectUpdated}
          />
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={onConfigSaved}
        onResetData={onResetData}
      />
    </div>
  );
};
