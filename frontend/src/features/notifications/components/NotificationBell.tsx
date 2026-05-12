import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useMarkAsRead, useNotifications } from "../notifications.hook";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

function NotificationBell() {
  const { data: notifications } = useNotifications();
  const { mutate: markRead } = useMarkAsRead();

  const notificationType = {
    inviteToFriend: "У вас новый запрос в друзья",
    likeToPost: "Ваш пост оценили",
    likeToComment: "Ваш комментарий понравился пользователю",
    acceptInviteToFriend: "Ваша заявка в друзья принята",
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications?.countUnread > 0 && (
            <span className="absolute top-1 right-1 bg-destructive text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              {notifications?.countUnread}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Уведомления</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {notifications?.notifications.length > 0 ? (
            notifications.notifications.map((notification: any) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${notification.isRead ? "bg-white" : "bg-slate-50 border-primary/20"}`}
                onMouseEnter={() =>
                  !notification.isRead && markRead(notification.id)
                }
              >
                {notification.type === "inviteToFriend" ||
                notification.type === "acceptInviteToFriend" ? (
                  <Link to="/friends">
                    <p className="text-sm">
                      {notificationType[notification.type]}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </Link>
                ) : (
                  <>
                    <p className="text-sm">
                      {notificationType[notification.type]}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">
              Уведомлений пока нет
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationBell;
