"use client";

import { TaskFilters, TaskStatus, SortOrder } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const STATUS_OPTIONS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function TaskFiltersBar({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: TaskFiltersBarProps) {
  const hasActiveFilters = filters.search || filters.status !== "all";

  function clearFilters() {
    onFiltersChange({ ...filters, search: "", status: "all" });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-8"
          />
        </div>

        {/* Status filter */}
        <Select
          value={filters.status}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, status: v as TaskStatus | "all" })
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Button
          variant="outline"
          size="default"
          className="gap-2 w-full sm:w-auto"
          onClick={() =>
            onFiltersChange({
              ...filters,
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
            })
          }
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="text-sm">
            Due {filters.sortOrder === "asc" ? "↑ Soonest" : "↓ Latest"}
          </span>
        </Button>

        {/* Clear */}
        {hasActiveFilters && (
          <Button variant="ghost" size="default" onClick={clearFilters} className="gap-1 w-full sm:w-auto">
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className={cn("font-medium", filteredCount === 0 && "text-destructive")}>
          {filteredCount}
        </span>{" "}
        of {totalCount} task{totalCount !== 1 ? "s" : ""}
        {hasActiveFilters && " (filtered)"}
      </p>
    </div>
  );
}
