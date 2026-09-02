export interface StudentResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  CGPA: number;
  activeBacklogs: number;
  resumeUrl: string;
  year: number;
}
export interface CompanyResponse {
  id: number;
  name: string;
  website: string;
  location: string;
  description: string;
}

export interface CompanyRequest {
  id?: number;          
  name: string;
  website?: string;
  location: string;
  description?: string;
}

export interface JobPostingResponse {
  id: number;
  title: string;
  description: string;
  salary: number;
  deadline: string;
  status: string;             
  eligibleCGPACutoff: number;
  allowedBacklogs: number;
  allowedBranches: string;
  requiredSkills: string;
  companyId: number;
  location: string;            

export interface JobPostingRequest {
  title: string;
  description?: string;
  eligibleCGPACutoff?: number;
  allowedBacklogs?: number;
  allowedBranches?: string;
  requiredSkills?: string;
  salary?: number;
  deadline: string;
  companyId?: number;
  location?: string;           
}

export interface DriveWithCompany {
  id: string;
  companyId: number;
  companyName: string;
  title: string;
  description: string;
  location: string;
  package: string;
  numericPackage: number;
  cgpaCutoff: number;
  maxBacklogs: number;
  allowedBranches: string[];
  deadline: string;
  skillsRequired: string[];
  status: 'OPEN' | 'CLOSED';
  registeredCount: number;
}

export type RecruiterStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface RecruiterResponse {
  id: number;
  name: string;
  email: string;
  companyName: string;
  designation: string;
  industry: string;
  recruiterStatus: RecruiterStatus;
}
export interface RecruiterRequest {
  name: string;
  email: string;
  password: string;
  companyName: string;
  designation?: string;
  industry?: string;
}
export type Role = "TPO" | "RECRUITER" | "STUDENT";

export interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  role: Role;
}

export interface StudentDashboardResponse {
  applicationsSubmitted: number;
  CGPA: number;
  activeBacklogs: number;
}

export interface DepartmentStat {
  department: string;
  totalStudents: number;
  placed: number;
  placementPercentage: number;
}

export interface SalaryRange {
  range: string;
  count: number;
}
export interface TPODashboardResponse {
  totalStudents: number;
  totalPlaced: number;
  placementPercentage: number;
  activeDrives: number;
  averageCTC: number;
  departmentStats: DepartmentStat[];
  salaryDistribution: SalaryRange[];
}
export interface StudentWithPlacement {
  id: string;
  name: string;
  email: string;
  department: string;
  cgpa: number;
  backlogs: number;
  placementStatus: "Placed" | "Unplaced";
  placedCompany?: string;
  placedPackage?: string;
  resumeScore: number;
  projectsCount: number;
  resumeText: string;
}

export interface ApplicationResponse {
  id: number;
  status: string;
  appliedDate: string;
  studentId: string;
  studentName: string;
  jobPostingId: number;
  jobTitle: string;
  companyName: string;
}

export interface PlacementEventResponse {
  id: number;
  title: string;
  eventType: string;
  companyId: number;
  companyName: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: string;
}

export interface InterviewRoundResponse {
  id: number;
  roundNumber: number;
  roundType: string;
  status: string;
  feedback: string | null;
  scheduledAt: string;
  applicationId: number;
}

export interface CalendarEvent {
  id: number;
  title: string;
  eventType: string;
  companyId: number;
  companyName: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: string;
}