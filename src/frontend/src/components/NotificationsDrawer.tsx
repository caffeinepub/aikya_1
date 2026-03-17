import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bell, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useClearNotifications, useNotifications } from "../hooks/useQueries";

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsDrawer({
  open,
  onClose,
}: NotificationsDrawerProps) {
  const { data: notifications = [] } = useNotifications();
  const clearMutation = useClearNotifications();

  const handleClear = async () => {
    try {
      await clearMutation.mutateAsync();
      toast.success("Notifications cleared");
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-80 glass border-l border-white/20 dark:border-white/5"
        data-ocid="notifications.sheet"
      >
        <SheetHeader className="flex flex-row items-center justify-between pr-6">
          <SheetTitle className="font-display flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-500" /> Notifications
          </SheetTitle>
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              className="text-xs text-destructive hover:text-destructive"
              data-ocid="notifications.delete_button"
            >
              <Trash2 className="w-3 h-3 mr-1" /> Clear all
            </Button>
          )}
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {notifications.length === 0 ? (
            <div
              className="text-center py-10"
              data-ocid="notifications.empty_state"
            >
              <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((notif, i) => (
              <div
                key={notif}
                className="glass rounded-xl p-3"
                data-ocid={`notifications.item.${i + 1}`}
              >
                <p className="text-sm text-foreground">{notif}</p>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
