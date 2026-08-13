import request from "./client";
import type { JobPostingResponse } from "./types";

export const jobPostingApi = {
  getAll: () =>
    request<JobPostingResponse[]>("/job-postings"),

  getById: (id: number) =>
    request<JobPostingResponse>(`/job-postings/${id}`),

  getByCompany: (companyId: number) =>
    request<JobPostingResponse[]>(
      `/companies/${companyId}/job-postings`
    ),

  updateStatus: (id: number, status: string) =>
    request<JobPostingResponse>(
      `/job-postings/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    ),
};