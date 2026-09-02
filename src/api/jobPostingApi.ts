import request from "./client";
import type {
  JobPostingResponse,
  JobPostingRequest,
  DriveWithCompany,
} from "./types";
import { companyApi } from "./companyApi";
import { applicationApi } from "./applicationApi";

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
      { method: "PATCH" }
    ),

  delete: (id: number) =>
    request<string>(`/job-postings/delete/${id}`, { method: "DELETE" }),

  getAllWithCompanyInfo: async (): Promise<DriveWithCompany[]> => {
    const [postings, companies, applications] = await Promise.all([
      request<JobPostingResponse[]>("/job-postings/all"),
      companyApi.getAll(),
      applicationApi.getAll(),
    ]);

    const companyById = new Map(companies.map((c) => [c.id, c]));

    const registeredCountByPosting = new Map<number, number>();
    for (const app of applications) {
      registeredCountByPosting.set(
        app.jobPostingId,
        (registeredCountByPosting.get(app.jobPostingId) ?? 0) + 1
      );
    }

    return postings.map((jp): DriveWithCompany => {
      const company = companyById.get(jp.companyId);
      return {
        id: String(jp.id),
        companyId: jp.companyId,
        companyName: company?.name ?? "Unknown Company",
        title: jp.title,
        description: jp.description,
        location: jp.location ?? '',
        package: jp.salary ? `${jp.salary} LPA` : "N/A",
        numericPackage: jp.salary ?? 0,
        cgpaCutoff: jp.eligibleCGPACutoff ?? 0,
        maxBacklogs: jp.allowedBacklogs ?? 0,
        allowedBranches: jp.allowedBranches
          ? jp.allowedBranches.split(",").map((b) => b.trim()).filter(Boolean)
          : [],
        deadline: jp.deadline,
        skillsRequired: jp.requiredSkills
          ? jp.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        status: jp.status === "OPEN" ? "OPEN" : "CLOSED",
        registeredCount: registeredCountByPosting.get(jp.id) ?? 0,
      };
    });
  },

  createDrive: async (
    companyName: string,
    companyLocation: string,
    companyWebsite: string | undefined,
    jobData: JobPostingRequest
  ): Promise<DriveWithCompany> => {
    const companies = await companyApi.getAll();
    const existing = companies.find(
      (c) => c.name.trim().toLowerCase() === companyName.trim().toLowerCase()
    );

    const company =
      existing ??
      (await companyApi.create({
        name: companyName.trim(),
        location: companyLocation.trim(),
        website: companyWebsite?.trim() || undefined,
      }));

    const posting = await companyApi.addJobPosting(company.id, jobData);

    return {
      id: String(posting.id),
      companyId: company.id,
      companyName: company.name,
      title: posting.title,
      description: posting.description,
      location: posting.location ?? '',
      package: posting.salary ? `${posting.salary} LPA` : "N/A",
      numericPackage: posting.salary ?? 0,
      cgpaCutoff: posting.eligibleCGPACutoff ?? 0,
      maxBacklogs: posting.allowedBacklogs ?? 0,
      allowedBranches: posting.allowedBranches
        ? posting.allowedBranches.split(",").map((b) => b.trim()).filter(Boolean)
        : [],
      deadline: posting.deadline,
      skillsRequired: posting.requiredSkills
        ? posting.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      status: "OPEN",
      registeredCount: 0,
    };
  },
};