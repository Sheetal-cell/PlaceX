import request from "./client";
import type {
  ApplicationResponse,
  InterviewRoundResponse,
} from "./types";

export const applicationApi = {
  getAll: () =>
    request<ApplicationResponse[]>("/applications/all"),

  getById: (id: number) =>
    request<ApplicationResponse>(`/applications/${id}`),

  getByStudent: (studentId: string) =>
    request<ApplicationResponse[]>(
      `/applications/my?studentId=${encodeURIComponent(studentId)}`
    ),

  create: (data: { studentId: string; jobPostingId: number }) =>
    request<ApplicationResponse>("/applications/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: number, status: string) => {
    const s = status.trim().toUpperCase();
    const validStatus = s === "SHORTLISTED" || s === "REJECTED" ? s : "APPLIED";
    return request<ApplicationResponse>(
      `/applications/${id}/status?newStatus=${encodeURIComponent(validStatus)}`,
      { method: "PATCH" }
    );
  },

  
  delete: (id: number) =>
    request<string>(`/applications/${id}`, { method: "DELETE" }),

  getRounds: (applicationId: number) =>
    request<InterviewRoundResponse[]>(
      `/applications/${applicationId}/rounds`
    ),

  
  addRound: (
    applicationId: number,
    data: {
      roundNumber: number;
      roundType: string;
      scheduledAt: string;
    }
  ) =>
    request<InterviewRoundResponse>(
      `/applications/${applicationId}/rounds`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updateRound: (
    applicationId: number,
    roundId: number,
    data: {
      roundNumber?: number;
      roundType?: string;
      scheduledAt?: string;
    }
  ) =>
    request<InterviewRoundResponse>(
      `/applications/${applicationId}/rounds/${roundId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),
};