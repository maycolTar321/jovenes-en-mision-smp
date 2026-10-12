import React, { useState, useEffect } from 'react';
import { Participant, MixedTeam, SocialProjectTracking, SystemConfig } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BottomMobileNav } from './components/common/BottomMobileNav';
import { PublicPage } from './pages/PublicPage';
import { AdminPage } from './pages/AdminPage';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { authService } from './services/authService';

export function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [publicSubView, setPublicSubView] = useState<'hero' | 'survey' | 'pillars'>('hero');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<MixedTeam[]>([]);
  const [project, setProject] = useState<SocialProjectTracking>(storageService.getProjectTracking());
  const [config, setConfig] = useState<SystemConfig>(storageService.getConfig());

  // Carga inicial de datos
  const loadData = () => {
    setParticipants(storageService.getParticipants());
    setTeams(storageService.getTeams());
    setProject(storageService.getProjectTracking());
    setConfig(storageService.getConfig());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleParticipantAdded = (newParticipant: Participant) => {
    const updated = storageService.getParticipants();
    setParticipants(updated);
  };

  const handleParticipantDeleted = (id: string) => {
    const updated = storageService.getParticipants();
    setParticipants(updated);
    // Limpiar de los equipos si estaba asignado
    const updatedTeams = teams.map(t => ({
      ...t,
      memberIds: t.memberIds.filter(mId => mId !== id)
    }));
    setTeams(updatedTeams);
    storageService.saveTeams(updatedTeams);
  };

  const handleResetData = () => {
    storageService.resetAllData();
    loadData();
  };

  const handleMobileGoHome = () => {
    setCurrentView('public');
    setPublicSubView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMobileGoSurvey = () => {
    setCurrentView('public');
    setPublicSubView('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMobileGoPillars = () => {
    setCurrentView('public');
    setPublicSubView('hero');
    // Desplazar suavemente a los pilares
    setTimeout(() => {
      const pillarsEl = document.querySelector('section.scroll-mt-24');
      if (pillarsEl) {
        pillarsEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 600, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleOpenAdmin = () => {
    if (authService.isAuthenticated()) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthModalOpen(false);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdmin = () => {
    authService.logout();
    setCurrentView('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 pb-16 md:pb-0">
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'admin') handleOpenAdmin();
          else {
            setCurrentView('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenAdminAuth={handleOpenAdmin}
        surveyCount={participants.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentView === 'public' ? (
          <PublicPage
            config={config}
            surveyCount={participants.length}
            onParticipantAdded={handleParticipantAdded}
            publicSubView={publicSubView}
            onPublicSubViewChange={setPublicSubView}
          />
        ) : (
          <AdminPage
            participants={participants}
            teams={teams}
            project={project}
            config={config}
            onParticipantDeleted={handleParticipantDeleted}
            onTeamsUpdated={setTeams}
            onProjectUpdated={setProject}
            onConfigSaved={setConfig}
            onResetData={handleResetData}
            onRefresh={loadData}
            onExitAdmin={handleExitAdmin}
          />
        )}
      </main>

      <Footer />

      {/* Barra de Navegación Inferior Móvil Estilo WhatsApp / App Nativa */}
      <BottomMobileNav
        currentView={currentView}
        onNavigateHome={handleMobileGoHome}
        onNavigateSurvey={handleMobileGoSurvey}
        onNavigatePillars={handleMobileGoPillars}
        onNavigateAdmin={handleOpenAdmin}
        surveyCount={participants.length}
      />

      {/* Modal de Acceso Restringido */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        config={config}
        onSuccess={handleAdminAuthSuccess}
        onClose={() => setIsAdminAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
