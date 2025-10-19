import { useState, useEffect } from "react";
import { ReminderCard, Reminder } from "@/components/ReminderCard";
import { AddReminderDialog } from "@/components/AddReminderDialog";
import { Bell, ListChecks } from "lucide-react";

const Index = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load reminders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("reminders");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const withDates = parsed.map((r: any) => ({
        ...r,
        dueDate: new Date(r.dueDate),
      }));
      setReminders(withDates);
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem("reminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  const addReminder = (newReminder: { title: string; description?: string; dueDate: Date }) => {
    const reminder: Reminder = {
      id: crypto.randomUUID(),
      ...newReminder,
      completed: false,
    };
    setReminders((prev) => [...prev, reminder].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()));
  };

  const toggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    // Update localStorage after deletion
    const updated = reminders.filter((r) => r.id !== id);
    if (updated.length === 0) {
      localStorage.removeItem("reminders");
    }
  };

  const activeReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 shadow-card">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Reminders</h1>
          <p className="text-muted-foreground text-lg">Never forget what matters</p>
        </div>

        {/* Add Reminder Button */}
        <div className="flex justify-center mb-8">
          <AddReminderDialog onAdd={addReminder} />
        </div>

        {/* Empty State */}
        {reminders.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
              <ListChecks className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No reminders yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first reminder to get started
            </p>
          </div>
        )}

        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Active ({activeReminders.length})
            </h2>
            <div className="space-y-3">
              {activeReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteReminder}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
              Completed ({completedReminders.length})
            </h2>
            <div className="space-y-3">
              {completedReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteReminder}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
