"use client";

import { Task, TaskStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, isOverdue, cn } from "@/lib/utils";
import { MoreHorizontal, Pencil, Trash2, Calendar, CheckCircle2, Circle, Clock } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: React.ReactNode; variant: "todo" | "in-progress" | "completed" }> = {
  todo: {
    label: "Todo",
    icon: <Circle className="h-3.5 w-3.5" />,
    variant: "todo",
  },
  "in-progress": {
    label: "In Progress",
    icon: <Clock className="h-3.5 w-3.5" />,
    variant: "in-progress",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    variant: "completed",
  },
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const config = STATUS_CONFIG[task.status];
  const overdue = isOverdue(task.dueDate) && task.status !== "completed";

  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        task.status === "completed" && "opacity-75"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={config.variant} className="gap-1">
                {config.icon}
                {config.label}
              </Badge>
              {overdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>

            <h3
              className={cn(
                "font-semibold text-sm leading-snug truncate",
                task.status === "completed" && "line-through text-muted-foreground"
              )}
              title={task.title}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className={cn(overdue && "text-destructive font-medium")}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>

          {/* Right: actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                aria-label="Task actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => onStatusChange(task.id, s)}
                  className={cn(task.status === s && "font-medium text-primary")}
                >
                  <span className="mr-2">{STATUS_CONFIG[s].icon}</span>
                  {STATUS_CONFIG[s].label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
