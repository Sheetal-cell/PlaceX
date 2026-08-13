import request from "./client";
import type { PlacementEventResponse } from "./types";

export const calendarApi = {
  getAll: () =>
    request<PlacementEventResponse[]>(
      "/calendar/events"
    ),

  getUpcoming: () =>
    request<PlacementEventResponse[]>(
      "/calendar/events/upcoming"
    ),

  create: (data: {
    title: string;
    eventType: string;
    companyId: number;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    status: string;
  }) =>
    request<PlacementEventResponse>(
      "/calendar/events",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  update: (
    id: number,
    data: Partial<PlacementEventResponse>
  ) =>
    request<PlacementEventResponse>(
      `/calendar/events/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),

  delete: (id: number) =>
    request<void>(
      `/calendar/events/${id}`,
      {
        method: "DELETE",
      }
    ),
};