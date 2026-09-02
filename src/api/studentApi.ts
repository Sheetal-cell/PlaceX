import request from "./client";
import type {
  StudentResponse,
  ApplicationResponse,
  StudentWithPlacement,
} from "./types";
import { applicationApi } from "./applicationApi";
import { jobPostingApi } from "./jobPostingApi";

export const studentApi = {
  getAll: () => request<StudentResponse[]>("/students/all"),

  getById: (id: string) => request<StudentResponse>(`/students/${id}`),

  getAllWithPlacementInfo: async (): Promise<StudentWithPlacement[]> => {
    const [students, applications, jobPostings] = await Promise.all([
      request<StudentResponse[]>("/students/all"),
      applicationApi.getAll(),
      jobPostingApi.getAll(),
    ]);

    const jobPostingById = new Map(jobPostings.map((jp) => [jp.id, jp]));

    const placedByStudent = new Map<string, ApplicationResponse>();
    for (const app of applications) {
      if (app.status === "SHORTLISTED") {
        placedByStudent.set(app.studentId, app);
      }
    }

    return students.map((s): StudentWithPlacement => {
      const placedApp = placedByStudent.get(s.id);
      const placedPosting = placedApp
        ? jobPostingById.get(placedApp.jobPostingId)
        : undefined;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        department: s.department,
        cgpa: s.CGPA,
        backlogs: s.activeBacklogs,
        placementStatus: placedApp ? "Placed" : "Unplaced",
        placedCompany: placedApp?.companyName,
        placedPackage: placedPosting?.salary
          ? `${placedPosting.salary} LPA`
          : undefined,
        resumeScore: 0,
        projectsCount: 0,
        resumeText: "",
      };
    });
  },
};