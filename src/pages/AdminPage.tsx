import React from 'react';
import { Participant, MixedTeam, SocialProjectTracking, SystemConfig } from '../types';
import { AdminLayout } from '../components/admin/AdminLayout';

interface AdminPageProps {
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

export const AdminPage: React.FC<AdminPageProps> = props => {
  return (
    <div className="py-6 sm:py-8">
      <AdminLayout {...props} />
    </div>
  );
};
