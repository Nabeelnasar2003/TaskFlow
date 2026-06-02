"use client";

import { Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Circle, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: <ListTodo className="h-4 w-4" />,
      color: "text-foreground",
      bg: "bg-secondary",
    },
    {
      label: "Todo",
      value: todo,
      icon: <Circle className="h-4 w-4" />,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-800",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: <Clock className="h-4 w-4" />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="border-0 shadow-none bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("rounded-md p-1.5", s.bg, s.color)}>{s.icon}</div>
            </div>
            <p className="text-2xl font-bold leading-none">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
