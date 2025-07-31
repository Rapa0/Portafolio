interface Project {
  id: string;
  userId: string;
  projectName: string;
  description: string;
  images: string[];
  videos: string[];
  codeSnippet: string;
  evidenceLinks: string[];
  type: string; 
  languageUsed: string; 
  completionDate: string;
  status: string;
}

export type { Project };
