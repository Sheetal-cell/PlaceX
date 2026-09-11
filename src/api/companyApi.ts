import request from "./client";
import type {
  CompanyResponse,
  CompanyRequest,
  JobPostingResponse,
  JobPostingRequest,
} from "./types";

export const companyApi = {
  getAll: () => request<CompanyResponse[]>("/companies/all"),

  getById: (id: number) => request<CompanyResponse>(`/companies/${id}`),

  create: (data: CompanyRequest) =>
    request<CompanyResponse>("/companies/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (data: CompanyRequest) =>
    request<CompanyResponse>("/companies/update", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<string>(`/companies/delete/${id}`, { method: "DELETE" }),

  getJobPostings: (companyId: number) =>
    request<JobPostingResponse[]>(`/companies/job-postings/${companyId}`),

  addJobPosting: (companyId: number, data: JobPostingRequest) =>
    request<JobPostingResponse>(`/companies/${companyId}/job-postings`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};