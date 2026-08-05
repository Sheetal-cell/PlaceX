export interface PlacementEvent {
  id: string;
  title: string;
  company: string;
  role: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  coordinator: string;
  branches: string[];
  description: string;
}

export const placementEvents: PlacementEvent[] = [
  {
    id: "1",
    title: "Microsoft PPT",
    company: "Microsoft",
    role: "Software Engineer Intern",
    type: "PPT",
    date: "2026-08-10",
    time: "10:00 AM",
    venue: "Seminar Hall",
    coordinator: "TPO Office",
    branches: ["CSE", "IT", "ECE"],
    description: "Pre-placement talk."
  },
  {
    id: "2",
    title: "Amazon OA",
    company: "Amazon",
    role: "SDE Intern",
    type: "OA",
    date: "2026-08-12",
    time: "9:00 AM",
    venue: "Lab 2",
    coordinator: "Placement Cell",
    branches: ["CSE", "IT"],
    description: "Online Coding Assessment."
  }
];