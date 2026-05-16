import { api } from "@/api/api";
import { Container } from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRespondToRequest } from "@/features/friends/friends.hook";
import type { PendingRequest, User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function FriendPage() {
  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await api.get("/friends");
      return data;
    },
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["friends", "pending"],
    queryFn: async () => {
      const { data } = await api.get("/friends/pending");
      return data;
    },
  });

  const { mutate: respond } = useRespondToRequest();
  return (
    <Container>
      <div className="py-8 space-y-8">
        {requests?.length > 0 && (
          <section>
            <h2 className="text-xl">Заявки в друзья ({requests.length})</h2>
            <div className="grid gap-4">
              {requests.map((req: PendingRequest) => (
                <Card key={req.id} className="mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <Link
                      to={`/profile/${req.requesterUser.username}`}
                      className="flex items-center gap-4"
                    >
                      <Avatar>
                        <AvatarImage
                          src={`http://localhost:3000${req.requesterUser.avatarUrl}`}
                        />
                        <AvatarFallback>
                          {req.requesterUser.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {req.requesterUser.firstName}{" "}
                          {req.requesterUser.lastName}
                        </p>
                        <p className="text-sm text-slate-500">
                          @{req.requesterUser.username}
                        </p>
                      </div>
                    </Link>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          respond({ requestId: req.id, status: "accepted" });
                        }}
                      >
                        Принять
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          respond({ requestId: req.id, status: "rejected" });
                        }}
                      >
                        Отклонить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="text-xl font-bold mb-4">Мои друзья</h2>
          {friends?.length > 0 ? (
            <div>
              {friends.map((friend: User) => (
                <Card key={friend.id} className="mb-3">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`http://localhost:3000${friend.avatarUrl}`}
                      />
                      <AvatarFallback>
                        {friend.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/profile/${friend.username}`}
                        className="font-medium hover:underline block truncate"
                      >
                        {friend.firstName} {friend.lastName}
                      </Link>
                      <p className="text-sm text-slate-500 truncate">
                        @{friend.username}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Написать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-10">
              У вас пока нет друзей.
            </p>
          )}
        </section>
      </div>
    </Container>
  );
}

export default FriendPage;
