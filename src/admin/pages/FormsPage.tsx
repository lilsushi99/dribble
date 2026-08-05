import React from 'react';
import { FormSubmissionData } from '../types/admin.types';
import { ContactCmsManager } from '../components/cms/ContactCmsManager';

export interface FormsPageProps {
  submissions: FormSubmissionData[];
}

export const FormsPage: React.FC<FormsPageProps> = () => {
  return <ContactCmsManager />;
};

