import React, { useState } from 'react';
import { Participant, PillarId, SystemConfig } from '../types';
import { HeroPresentation } from '../components/public/HeroPresentation';
import { SurveyWizard } from '../components/public/SurveyWizard';
import { SurveyConfirmation } from '../components/public/SurveyConfirmation';

interface PublicPageProps {
  config: SystemConfig;
  surveyCount: number;
  onParticipantAdded: (participant: Participant) => void;
  publicSubView?: 'hero' | 'survey' | 'pillars';
  onPublicSubViewChange?: (view: 'hero' | 'survey' | 'pillars') => void;
}

export const PublicPage: React.FC<PublicPageProps> = ({ 
  config, 
  surveyCount, 
  onParticipantAdded,
  publicSubView,
  onPublicSubViewChange
}) => {
  const [internalViewState, setInternalViewState] = useState<'hero' | 'survey' | 'confirmation'>('hero');
  const [lastSubmitted, setLastSubmitted] = useState<Participant | null>(null);
  const [chosenPillar, setChosenPillar] = useState<PillarId | undefined>(undefined);

  // Si internalViewState está en confirmation, tiene prioridad absoluta sobre cualquier subview
  const viewState = internalViewState === 'confirmation'
    ? 'confirmation'
    : (publicSubView === 'survey' ? 'survey' : internalViewState);

  const handleStartSurvey = (selectedPillar?: PillarId) => {
    setChosenPillar(selectedPillar);
    setInternalViewState('survey');
    if (onPublicSubViewChange) onPublicSubViewChange('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSurveyCompleted = (participant: Participant) => {
    setLastSubmitted(participant);
    onParticipantAdded(participant);
    setInternalViewState('confirmation');
    if (onPublicSubViewChange) onPublicSubViewChange('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToHero = () => {
    setInternalViewState('hero');
    if (onPublicSubViewChange) onPublicSubViewChange('hero');
    setLastSubmitted(null);
    setChosenPillar(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-3 sm:py-8">
      {viewState === 'hero' && (
        <HeroPresentation
          onStartSurvey={handleStartSurvey}
          surveyCount={surveyCount}
        />
      )}

      {viewState === 'survey' && (
        <SurveyWizard
          config={config}
          initialPillar={chosenPillar}
          onCompleted={handleSurveyCompleted}
          onCancel={handleResetToHero}
        />
      )}

      {viewState === 'confirmation' && lastSubmitted && (
        <SurveyConfirmation
          participant={lastSubmitted}
          onReset={handleResetToHero}
        />
      )}
    </div>
  );
};
