"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus } from "@/types";
import { MOCK_TASKS } from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "taskflow_tasks";

export type CreateTaskInput = Omit<Task, "id" | "createdAt">;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">>;

function loadTasks(): Task[] {
  if (typeof window === "undefined") return MOCK_TASKS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Task[];
    // Seed with mock data on first load
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TASKS));
    return MOCK_TASKS;
  } catch {
    return MOCK_TASKS;
  }
}

function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setIsLoaded(true);
  }, []);

  const createTask = useCallback((input: CreateTaskInput) => {
    const newTask: Task = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveTasks(updated);
      return updated;
    });
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...input } : t));
      saveTasks(updated);
      return updated;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasks(updated);
      return updated;
    });
  }, []);

  const updateStatus = useCallback((id: string, status: TaskStatus) => {
    updateTask(id, { status });
  }, [updateTask]);

  return { tasks, isLoaded, createTask, updateTask, deleteTask, updateStatus };
}
