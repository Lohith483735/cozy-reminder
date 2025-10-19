import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2, Clock, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { format } from "date-fns";

export type Priority = "high" | "medium" | "low";
export type Category = "work" | "personal" | "health" | "shopping" | "other";

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  priority: Priority;
  category: Category;
}

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderCard = ({ reminder, onToggleComplete, onDelete }: ReminderCardProps) => {
  const isPast = new Date(reminder.dueDate) < new Date() && !reminder.completed;

  const priorityConfig = {
    high: { icon: AlertCircle, color: "bg-destructive/10 text-destructive border-destructive/20", label: "High" },
    medium: { icon: AlertTriangle, color: "bg-orange-500/10 text-orange-600 border-orange-500/20", label: "Medium" },
    low: { icon: Info, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "Low" },
  };

  const categoryConfig = {
    work: { color: "bg-purple-500/10 text-purple-600 border-purple-500/20", label: "Work" },
    personal: { color: "bg-green-500/10 text-green-600 border-green-500/20", label: "Personal" },
    health: { color: "bg-red-500/10 text-red-600 border-red-500/20", label: "Health" },
    shopping: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", label: "Shopping" },
    other: { color: "bg-gray-500/10 text-gray-600 border-gray-500/20", label: "Other" },
  };

  const PriorityIcon = priorityConfig[reminder.priority].icon;

  return (
    <Card
      className={`p-4 transition-all duration-300 hover:shadow-card-hover animate-fade-in ${
        reminder.completed ? "opacity-60" : ""
      } ${isPast ? "border-destructive/50" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3
              className={`text-lg font-semibold text-foreground ${
                reminder.completed ? "line-through" : ""
              }`}
            >
              {reminder.title}
            </h3>
            <Badge variant="outline" className={`${priorityConfig[reminder.priority].color} gap-1`}>
              <PriorityIcon className="w-3 h-3" />
              {priorityConfig[reminder.priority].label}
            </Badge>
            <Badge variant="outline" className={categoryConfig[reminder.category].color}>
              {categoryConfig[reminder.category].label}
            </Badge>
          </div>
          {reminder.description && (
            <p className="text-sm text-muted-foreground mb-3">{reminder.description}</p>
          )}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className={isPast && !reminder.completed ? "text-destructive font-medium" : ""}>
              {format(new Date(reminder.dueDate), "PPp")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onToggleComplete(reminder.id)}
            className={`transition-all ${reminder.completed ? "bg-primary text-primary-foreground" : ""}`}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(reminder.id)}
            className="hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
