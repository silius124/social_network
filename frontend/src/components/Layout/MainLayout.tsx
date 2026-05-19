import { useAuthStore } from "@/features/auth/useAuthStore";
import { Link, Navigate, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import GlobalSearch from "../GlobalSearch";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

function MainLayout() {
  const { isAuth, logout, user } = useAuthStore();
  const queryClient = useQueryClient();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-primary">Nodix</h1>
            <nav className="hidden md:flex gap-4 text-sm font-medium">
              <Link to="/" className="hover:text-primary">
                Лента
              </Link>
              <Link to="/friends" className="hover:text-primary">
                Друзья
              </Link>
              <Link to="/message" className="hover:text-primary">
                Сообщения
              </Link>
            </nav>
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <Button
              variant={"ghost"}
              className="text-sm text-slate-600 hover:text-primary"
            >
              <Link to={`/profile/${user?.username}`}>{user?.username}</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-destructive/20 text-destructive/60 border border-destructive/60 hover:bg-destructive hover:text-white">
                  Выйти
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Вы уверены, что хотите выйти из аккаунта?
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      queryClient.clear();
                      logout();
                    }}
                    className="bg-destructive text-white hover:bg-destructive/30 hover:text-destructive/80 "
                  >
                    Выйти
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
