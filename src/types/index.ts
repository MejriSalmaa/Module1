// User and Authentication Types
export type UserRole = 'client' | 'admin' | 'talent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
}

// Job Offer Types
export type JobStatus = 'draft' | 'submitted' | 'validated' | 'open' | 'closed';
export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export type SeniorityLevel = 'intern' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
export type RoleType = 'frontend' | 'backend' | 'fullstack' | 'devops' | 'data' | 'mobile' | 'qa';

export interface Skill {
  name: string;
  priority: 'must-have' | 'nice-to-have';
  level?: SeniorityLevel;
}

export interface JobOffer {
  id: string;
  title: string;
  role: RoleType;
  skills: Skill[];
  seniorityLevel: SeniorityLevel;
  projectDuration: string;
  startDate: string;
  budgetRange: { min: number; max: number; currency: string };
  softSkills: string[];
  workMode: WorkMode;
  status: JobStatus;
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// Talent Types
export interface TalentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  location: string;
  timezone: string;
  skills: { name: string; level: SeniorityLevel }[];
  experience: number; // years
  education: string;
  certifications: string[];
  availability: 'available' | 'partially-available' | 'unavailable';
  dailyRate: { amount: number; currency: string };
  hourlyRate: { amount: number; currency: string };
  customTags: string[];
  matchingScore?: number;
  riskIndicators?: string[];
  strengths?: string[];
}

// Talent Request Types
export type RequestType = 'shortlist' | 'single-profile' | 'backup-profiles';
export type RequestUrgency = 'low' | 'medium' | 'high' | 'urgent';

export interface TalentRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  skills: Skill[];
  urgency: RequestUrgency;
  availability: string;
  timezone: string;
  requestType: RequestType;
  status: 'pending' | 'in-review' | 'matched' | 'completed';
  createdAt: string;
  matchedTalents?: TalentProfile[];
}

// Assessment Types
export type AssessmentType = 'technical' | 'soft-skill' | 'code-challenge';
export type AssessmentStatus = 'pending' | 'in-progress' | 'completed' | 'expired';

export interface Assessment {
  id: string;
  talentId: string;
  type: AssessmentType;
  title: string;
  description: string;
  status: AssessmentStatus;
  score?: number;
  maxScore: number;
  startedAt?: string;
  completedAt?: string;
  deadline?: string;
  repoUrl?: string; // for code challenges
}

// Pipeline Types
export type PipelineStage = 
  | 'applied' 
  | 'screening' 
  | 'assessed' 
  | 'interview-scheduled' 
  | 'results' 
  | 'accepted' 
  | 'rejected';

export interface Application {
  id: string;
  talentId: string;
  talentName: string;
  talentAvatar?: string;
  jobOfferId: string;
  jobTitle: string;
  stage: PipelineStage;
  matchingScore: number;
  appliedAt: string;
  lastUpdated: string;
  interviewDate?: string;
  notes?: string;
}

// Notification Types
export type NotificationType = 
  | 'application-received'
  | 'assessment-assigned'
  | 'assessment-completed'
  | 'interview-scheduled'
  | 'final-decision';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
