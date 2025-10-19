import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, TrendingUp, Target } from "lucide-react";
import { Reminder } from "./ReminderCard";

interface StatisticsPanelProps {
  reminders: Reminder[];
}

export const StatisticsPanel = ({ reminders }: StatisticsPanelProps) => {
  const total = reminders.length;
  const completed = reminders.filter((r) => r.completed).length;
  const active = total - completed;
  const overdue = reminders.filter(
    (r) => !r.completed && new Date(r.dueDate) < new Date()
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Active",
      value: active,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: Target,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Completion",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="p-4 animate-scale-in hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
