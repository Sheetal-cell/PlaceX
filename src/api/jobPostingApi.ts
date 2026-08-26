import request from "./client";
import type { JobPostingResponse } from "./types";

export const jobPostingApi = {
  getAll: () =>
    request<JobPostingResponse[]>("/job-postings/all"),

  getById: (id: number) =>
    request<JobPostingResponse>(`/job-postings/${id}`),

  getByCompany: (companyId: number) =>
    request<JobPostingResponse[]>(
      `/companies/job-postings/${companyId}`
    ),

 updateStatus: (id: number, status: string) =>
  request<JobPostingResponse>(
    `/job-postings/${id}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PATCH",
    }
  ),
};