"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { Task, TaskStatus, TaskFilters } from "@/types";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFormModal } from "@/components/tasks/task-form-modal";
import { DeleteConfirmDialog } from "@/components/tasks/delete-confirm-dialog";
import { TaskFiltersBar } from "@/components/tasks/task-filters-bar";
import { TaskStats } from "@/components/tasks/task-stats";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckSquare, Plus, LogOut, Moon, Sun, User, Loader2, ClipboardList } from "lucide-react";

const THEME_KEY = "taskflow_theme";

const DEFAULT_FILTERS: TaskFilters = {
  status: "all",
  search: "",
  sortOrder: "asc",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { tasks, isLoaded, createTask, updateTask, deleteTask, updateStatus } = useTasks();

  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [isDark, setIsDark] = useState(false);

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Theme
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const dark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace("/");
  }, [user, authLoading, router]);

  // Filtered + sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.status !== "all") {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return filters.sortOrder === "asc" ? diff : -diff;
    });

    return result;
  }, [tasks, filters]);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  function handleCreateSubmit(data: Parameters<typeof createTask>[0]) {
    createTask(data);
  }

  function handleEditSubmit(data: Parameters<typeof createTask>[0]) {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingTask(null);
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CheckSquare className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight">TaskFlow</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User menu">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Good {getGreeting()}, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here's what's on your plate today.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTask(null);
              setFormOpen(true);
            }}
            className="gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>

        {/* Stats */}
        {isLoaded && <TaskStats tasks={tasks} />}

        {/* Filters */}
        <TaskFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={tasks.length}
          filteredCount={filteredTasks.length}
        />

        {/* Task grid */}
        {!isLoaded ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary mb-4">
              <ClipboardList className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-base">No tasks found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              {tasks.length === 0
                ? "You're all clear! Create a new task to get started."
                : "Try adjusting your filters or search query."}
            </p>
            {tasks.length === 0 && (
              <Button
                className="mt-4 gap-2"
                onClick={() => {
                  setEditingTask(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Create your first task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={(t) => setDeletingTask(t)}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <TaskFormModal
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSubmit={editingTask ? handleEditSubmit : handleCreateSubmit}
        task={editingTask}
      />

      <DeleteConfirmDialog
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) {
            deleteTask(deletingTask.id);
            setDeletingTask(null);
          }
        }}
        taskTitle={deletingTask?.title ?? ""}
      />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
