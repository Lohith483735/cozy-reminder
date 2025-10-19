import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Priority, Category } from "./ReminderCard";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterPriority: Priority | "all";
  onPriorityChange: (priority: Priority | "all") => void;
  filterCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
  sortBy: "date" | "priority";
  onSortChange: (sort: "date" | "priority") => void;
}

export const SearchFilter = ({
  searchQuery,
  onSearchChange,
  filterPriority,
  onPriorityChange,
  filterCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: SearchFilterProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search reminders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={filterPriority} onValueChange={(value) => onPriorityChange(value as Priority | "all")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={(value) => onCategoryChange(value as Category | "all")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as "date" | "priority")}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="priority">Sort by Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
