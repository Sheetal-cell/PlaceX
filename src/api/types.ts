

export interface StudentResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
}

export interface JobPostingResponse {
  id: number;
  title: string;
  description: string;
  salary: number;
  deadline: string;
  status: string;
  companyId: number;
  companyName: string;
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