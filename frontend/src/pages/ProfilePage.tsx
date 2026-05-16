import { Container } from "@/components/Container";
import { SkeletonPost } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/useAuthStore";
import CreatePostForm from "@/features/posts/components/CreatePostForm";
import PostCard from "@/features/posts/components/PostCard";
import { useUserPosts } from "@/features/posts/posts.hooks";
import EditProfileModal from "@/features/profile/components/EditProfileModal";
import { useUsersProfile } from "@/features/profile/profile.hooks";
import {
  useDeleteFriendShip,
  useRespondToRequest,
  useSendFriendRequest,
} from "@/features/friends/friends.hook";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Post } from "@/types/types";

function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuthStore();
  const { data: user, isLoading: userLoading } = useUsersProfile(
    username || "",
  );
  const { data: userPosts, isLoading: postLoading } = useUserPosts(user?.id);
  const { mutate: sendRequest, isPending: isSendingRequest } =
    useSendFriendRequest();
  const { mutate: respondToRequest, isPending: isSendingRespond } =
    useRespondToRequest();
  const { mutate: deleteFriendShip } = useDeleteFriendShip();
  const navigate = useNavigate();

  const isMyProfile = currentUser?.username === username;

  if (userLoading)
    return <div className="text-center p-10">Загрузка профиля...</div>;

  if (!user)
    return <div className="text-center p-10">Пользователь не найден</div>;

  const iAmRequester = user.requesterId === currentUser?.id;

  const friendActionConfig = {
    pending: iAmRequester
      ? { label: "Ожидание подтверждения", disabled: true, action: () => {} }
      : {
          label: "Принять заявку",
          disabled: false,
          action: () => {
            respondToRequest({
              requestId: user.friendShipId,
              status: "accepted",
            });
          },
        },
    accepted: {
      label: "Удалить из друзей",
      disabled: false,
      action: () => {
        deleteFriendShip(user.friendShipId);
      },
    },
    rejected: {
      label: "Добавить в друзья",
      disabled: false,
      action: () => {
        sendRequest(user.id);
      },
    },
  } satisfies Record<
    string,
    { label: string; disabled: boolean; action: () => void }
  >;

  const config = user.status
    ? friendActionConfig[user.status as keyof typeof friendActionConfig]
    : {
        label: "Добавить в друзья",
        disabled: false,
        action: () => {
          sendRequest(user.id);
        },
      };

  return (
    <Container>
      <Card className="my-8 border-none shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-2 border-primary/10 rounded-full flex items-center justify-center bg-primary/5">
              <AvatarImage
                src={`${user?.avatarUrl ? `http://localhost:3000${user?.avatarUrl}` : ""}`}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="text-2xl text-primary ">
                {user?.username?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row  md:items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <span className="text-slate-500 text-sm">
                  @{user?.username}
                </span>
              </div>

              <div className="flex justify-center md:justify-start gap-6 mt-4">
                <div className="text-center">
                  <span className="block font-bold text-lg">
                    {user?._count.posts}
                  </span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">
                    Постов
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              {isMyProfile ? (
                <EditProfileModal />
              ) : (
                <div className="flex flex-col gap-3">
                  {user.status === "accepted" && (
                    <Button variant="outline">
                      <Link to={`/message?friendId=${user.id}`}>
                        Написать сообщение
                      </Link>
                    </Button>
                  )}
                  <Button
                    onClick={config.action}
                    disabled={
                      config.disabled || isSendingRequest || isSendingRespond
                    }
                    variant={user.status === "accepted" && "destructive"}
                    className={`${user.status === "accepted" ? "bg-destructive/20 text-destructive/60 border border-destructive/60 hover:text-white" : ""}`}
                  >
                    {isSendingRequest && isSendingRespond && !user.status
                      ? "Отправка..."
                      : config.label}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isMyProfile && <CreatePostForm />}

      <div className="space-y-4 mt-4">
        <h3 className="font-semibold text-lg text-slate-800 px-1">
          Мои публикации
        </h3>
        {postLoading && (
          <>
            <SkeletonPost />
            <SkeletonPost />
          </>
        )}
        {!postLoading && userPosts && userPosts.length > 0 ? (
          userPosts.map((post: Post) => <PostCard key={post.id} post={post} />)
        ) : (
          <Card className="border-dashed shadow-none bg-transparent">
            <CardContent className="py-12 text-center text-slate-400">
              Вы еще не создали ни одного поста.
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}

export default ProfilePage;
