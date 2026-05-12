import { Container } from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/features/profile/profile.hooks";
import type { User } from "@/types/types";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const queryParam = searchParams.get("q") || "";

  const { data: users, isLoading } = useSearchUsers(queryParam);
  return (
    <Container>
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">
          Результаты поиска по: {queryParam}
        </h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Введите имя или username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          {isLoading && (
            <p className="text-center text-slate-500">Загрузка...</p>
          )}

          {users?.map((user: User) => (
            <Link key={user.id} to={`/profile/${user.username}`}>
              <Card className="hover:bg-slate-50 transition-colors cursor-pointer mb-2">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={`http://localhost:3000${user.avatarUrl}`}
                      alt="Аватарка профиля"
                    />
                    <AvatarFallback>
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{user.username}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {searchTerm && !isLoading && users?.length === 0 && (
            <p className="text-center text-slate-500">Никого не найдено</p>
          )}
        </div>
      </div>
    </Container>
  );
}

export default SearchPage;
