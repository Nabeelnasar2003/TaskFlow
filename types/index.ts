export type TaskStatus = "todo" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string; // ISO date string
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
}

export type SortOrder = "asc" | "desc";

export interface TaskFilters {
  status: TaskStatus | "all";
  search: string;
  sortOrder: SortOrder;
}
