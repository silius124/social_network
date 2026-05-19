import { useSearchUsers } from "@/features/profile/profile.hooks";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function GlobalSearch() {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: users } = useSearchUsers(query);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/search?q=${query}`);
  };

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Поиск..."
          className="pl-10 h-9 bg-slate-100 border-none focus-visible:ring-1"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      {isOpen && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto">
            {users?.slice(0, 5).map((user: any) => (
              <div
                key={user.id}
                onClick={() => {
                  navigate(`/profile/${user.username}`);
                  setIsOpen(false);
                  setQuery("");
                }}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b last:border-none"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`http://192.168.1.101:3000${user.avatarUrl}`}
                    alt="Аватарка профиля"
                  />
                  <AvatarFallback>
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.username}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleSearch}
            className="w-full p-2 text-center text-xs font-semibold text-blue-600 bg-slate-50 hover:bg-slate-100"
          >
            Показать все результаты
          </button>
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
