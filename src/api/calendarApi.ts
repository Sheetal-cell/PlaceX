import request from "./client";
import type { PlacementEventResponse } from "./types";

export const calendarApi = {
  getAll: (filters?: { year?: number; month?: number; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.year) params.set("year", String(filters.year));
    if (filters?.month) params.set("month", String(filters.month));
    if (filters?.status) params.set("status", filters.status);
    const query = params.toString();
    return request<PlacementEventResponse[]>(
      `/calendar/events/all${query ? `?${query}` : ""}`
    );
  },

  getUpcoming: () =>
    request<PlacementEventResponse[]>("/calendar/events/upcoming"),

  create: (data: {
    title: string;
    eventType: string;
    companyId?: number;
    scheduledDate: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    description?: string;
  }) =>
    request<PlacementEventResponse>("/calendar/events/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: {
      title: string;
      eventType: string;
      companyId?: number;
      scheduledDate: string;
      startTime?: string;
      endTime?: string;
      location?: string;
      description?: string;
    }
  ) =>
    request<PlacementEventResponse>(`/calendar/events/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  
  cancel: (id: number) =>
    request<PlacementEventResponse>(`/calendar/events/delete/${id}`, {
      method: "DELETE",
    }),
};