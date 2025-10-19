import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
}

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderCard = ({ reminder, onToggleComplete, onDelete }: ReminderCardProps) => {
  const isPast = new Date(reminder.dueDate) < new Date() && !reminder.completed;

  return (
    <Card
      className={`p-4 transition-all duration-300 hover:shadow-card-hover ${
        reminder.completed ? "opacity-60" : ""
      } ${isPast ? "border-destructive/50" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`text-lg font-semibold text-foreground ${
                reminder.completed ? "line-through" : ""
              }`}
            >
              {reminder.title}
            </h3>
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
            className={reminder.completed ? "bg-primary text-primary-foreground" : ""}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(reminder.id)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
