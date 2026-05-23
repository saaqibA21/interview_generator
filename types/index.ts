export interface User {
  _id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'admin' | 'user' | 'recruiter';
  companyName?: string;
  plan: 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Job {
  _id?: string;
  userId: string;
  title: string;
  companyName: string;
  description: string;
  extractedRequirements?: {
    hardSkills: string[];
    softSkills: string[];
    experienceLevel: string;
    responsibilities: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Candidate {
  _id?: string;
  userId: string;
  name: string;
  email: string;
  resumeText: string;
  extractedProfile?: {
    skills: string[];
    projects: Project[];
    experience: Experience[];
    education: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Question {
  category: string;
  question: string;
  candidateSpecificReason: string;
  linkedResumeEvidence: string;
  linkedJobRequirement: string;
  strongAnswerShouldInclude: string[];
  followUps: string[];
  scoreWeight: number;
}

export interface InterviewReport {
  _id?: string;
  userId: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  matchScore: number;
  roleSummary: string;
  realRoleRequirements: string[];
  candidateSummary: string;
  strengths: string[];
  gaps: string[];
  resumeClaimsToVerify: string[];
  redFlags: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  interviewStrategy: string;
  questions: Question[];
  scorecard: {
    technicalDepth: number;
    projectOwnership: number;
    problemSolving: number;
    communication: number;
    roleFit: number;
    productionReadiness: number;
  };
  finalRecommendation: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BulkRanking {
  _id?: string;
  userId: string;
  jobId: string;
  candidates: {
    candidateId: string;
    name: string;
    matchScore: number;
    strengths: string[];
    weaknesses: string[];
    riskLevel: string;
    recommendedAction: string;
  }[];
  createdAt?: Date;
}
