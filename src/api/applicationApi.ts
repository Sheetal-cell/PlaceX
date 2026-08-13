import request from "./client";
import type {
  ApplicationResponse,
  InterviewRoundResponse,
} from "./types";

export const applicationApi = {
  getAll: () =>
    request<ApplicationResponse[]>("/applications"),

  getById: (id: number) =>
    request<ApplicationResponse>(`/applications/${id}`),

  updateStatus: (id: number, status: string) =>
    request<ApplicationResponse>(
      `/applications/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    ),

  getRounds: (applicationId: number) =>
    request<InterviewRoundResponse[]>(
      `/applications/${applicationId}/rounds`
    ),

  addRound: (
    applicationId: number,
    data: {
      roundNumber: number;
      roundType: string;
      status: string;
      feedback?: string;
      scheduledAt?: string;
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
      status?: string;
      feedback?: string;
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