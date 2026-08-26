import request from "./client";
import type { StudentResponse } from "./types";

export const studentApi = {
  getAll: () =>
    request<StudentResponse[]>("/students/all"),

  getById: (id: string) =>
    request<StudentResponse>(`/students/${id}`),
};