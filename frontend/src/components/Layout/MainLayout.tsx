import { useAuthStore } from "@/features/auth/useAuthStore";
import { Link, Navigate, Outlet } from "react-router-dom";
import { Button } from "../ui/button";

function MainLayout() {
  const { isAuth, logout, user } = useAuthStore();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-primaryq">Nodix</h1>
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
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.username}</span>
            <Button
              onClick={logout}
              className="bg-destructive/20 text-destructive/50 border border-destructive/40 hover:bg-destructive hover:text-white"
            >
              Выйти
            </Button>
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
