export interface ScrapedDrive {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  source: string;
  deadline: string;
  posted: string;
  status: "Pending" | "Approved" | "Rejected";
  description: string;
  skills: string[];
  applyLink: string;
}

export const scrapedDrives: ScrapedDrive[] = [
  {
    id: "1",
    company: "Microsoft",
    role: "Software Engineer Intern",
    location: "Hyderabad",
    salary: "18 LPA",
    source: "LinkedIn",
    deadline: "15 Aug 2026",
    posted: "2 hours ago",
    status: "Pending",
    description:
      "Hiring software engineering interns for cloud platform development.",
    skills: ["C++", "DSA", "React"],
    applyLink: "#",
  },
  {
    id: "2",
    company: "Amazon",
    role: "SDE Intern",
    location: "Bangalore",
    salary: "20 LPA",
    source: "Career Page",
    deadline: "18 Aug 2026",
    posted: "Today",
    status: "Pending",
    description:
      "Amazon is hiring interns for backend engineering.",
    skills: ["Java", "AWS"],
    applyLink: "#",
  }
];