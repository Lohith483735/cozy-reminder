import { useState, useEffect } from "react";
import { ReminderCard, Reminder, Priority, Category } from "@/components/ReminderCard";
import { AddReminderDialog } from "@/components/AddReminderDialog";
import { StatisticsPanel } from "@/components/StatisticsPanel";
import { SearchFilter } from "@/components/SearchFilter";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Bell, ListChecks } from "lucide-react";
import { NotificationService } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Request notification permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        toast({
          title: "Notifications enabled",
          description: "You'll receive alerts when reminders are due",
        });
      }
    };
    requestPermissions();
  }, []);

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

  const addReminder = async (newReminder: { title: string; description?: string; dueDate: Date; priority: Priority; category: Category }) => {
    const reminder: Reminder = {
      id: crypto.randomUUID(),
      ...newReminder,
      completed: false,
    };
    setReminders((prev) => [...prev, reminder]);
    
    // Schedule notification
    const notificationId = NotificationService.generateNotificationId(reminder.id);
    await NotificationService.scheduleNotification({
      id: notificationId,
      title: reminder.title,
      body: reminder.description || "Time to complete this reminder!",
      scheduleAt: reminder.dueDate,
    });
  };

  const toggleComplete = async (id: string) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder && !reminder.completed) {
      // Cancel notification when marking as complete
      const notificationId = NotificationService.generateNotificationId(id);
      await NotificationService.cancelNotification(notificationId);
    }
    
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const confirmDelete = (id: string) => {
    setReminderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deleteReminder = async () => {
    if (!reminderToDelete) return;
    
    // Cancel notification when deleting
    const notificationId = NotificationService.generateNotificationId(reminderToDelete);
    await NotificationService.cancelNotification(notificationId);
    
    setReminders((prev) => prev.filter((r) => r.id !== reminderToDelete));
    // Update localStorage after deletion
    const updated = reminders.filter((r) => r.id !== reminderToDelete);
    if (updated.length === 0) {
      localStorage.removeItem("reminders");
    }
    
    setDeleteDialogOpen(false);
    setReminderToDelete(null);
    
    toast({
      title: "Reminder deleted",
      description: "Your reminder has been removed",
    });
  };

  // Filter and sort reminders
  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || reminder.priority === filterPriority;
    const matchesCategory = filterCategory === "all" || reminder.category === filterCategory;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    if (sortBy === "date") {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
  });

  const activeReminders = sortedReminders.filter((r) => !r.completed);
  const completedReminders = sortedReminders.filter((r) => r.completed);

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

        {/* Statistics */}
        {reminders.length > 0 && <StatisticsPanel reminders={reminders} />}

        {/* Search and Filters */}
        {reminders.length > 0 && (
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterPriority={filterPriority}
            onPriorityChange={setFilterPriority}
            filterCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

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
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Active ({activeReminders.length})
            </h2>
            <div className="space-y-3">
              {activeReminders.map((reminder, index) => (
                <div key={reminder.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <ReminderCard
                    reminder={reminder}
                    onToggleComplete={toggleComplete}
                    onDelete={confirmDelete}
                  />
                </div>
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
              {completedReminders.map((reminder, index) => (
                <div key={reminder.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <ReminderCard
                    reminder={reminder}
                    onToggleComplete={toggleComplete}
                    onDelete={confirmDelete}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {reminders.length > 0 && filteredReminders.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
              <ListChecks className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No matches found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your reminder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteReminder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
