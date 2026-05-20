import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/useAuthStore";
import {
  useChatMessages,
  useChats,
  useDeleteChat,
  useExistingChat,
} from "@/features/chat/chat.hooks";
import { getSocket } from "@/features/chat/socket.service";
import { useUsersProfile } from "@/features/profile/profile.hooks";
import type { Chat, Message } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function MessagesPage() {
  const { token, user: currentUser } = useAuthStore();
  const { data: chats } = useChats();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [content, setContent] = useState<string>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { data: history } = useChatMessages(currentChatId);
  const [searchParam] = useSearchParams();
  const friendIdFromUrl = Number(searchParam.get("friendId"));
  const { data: existingChat } = useExistingChat(friendIdFromUrl);
  const { data: friend } = useUsersProfile(undefined, friendIdFromUrl);
  const queryClient = useQueryClient();
  const { mutate: deleteChat } = useDeleteChat();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const allMessages = useMemo<Message[]>(() => {
    const historyIds = new Set((history || []).map((m) => m.id));
    const uniqueNew = messages.filter((m) => !historyIds.has(m.id));
    return [...(history || []), ...uniqueNew];
  }, [history, messages]);

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);

    socket.on("chatCreated", ({ chatId }) => {
      setCurrentChatId(chatId);
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({
        queryKey: ["existingChat", friendIdFromUrl],
      });
    });

    return () => {
      socket.off("chatCreated");
    };
  }, [token, queryClient, friendIdFromUrl]);

  useEffect(() => {
    if (!token || !currentChatId) return;

    const socket = getSocket(token);

    socket.emit("joinRoom", { chatId: currentChatId });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("chatHistory", ({ chatId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    });

    return () => {
      socket.off("newMessage");
      socket.off("chatHistory");
      setMessages([]);
    };
  }, [token, currentChatId, queryClient]);

  useEffect(() => {
    setCurrentChatId(null);
    setMessages([]);

    if (existingChat?.id) {
      setCurrentChatId(existingChat.id);
    }
  }, [existingChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const sendMessage = () => {
    if (!token || !content?.trim() || (!currentChatId && !friendIdFromUrl))
      return;

    const socket = getSocket(token);
    if (currentChatId) {
      socket.emit("sendMessage", { chatId: currentChatId, content });
    } else if (friendIdFromUrl) {
      socket.emit("sendMessage", {
        friendId: Number(friendIdFromUrl),
        content,
      });
    }

    setContent("");
  };

  useEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  const handleSelectChat = (id: number) => {
    if (currentChatId === id) return;
    queryClient.invalidateQueries({ queryKey: ["messages"] });
    setMessages([]);

    setCurrentChatId(id);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex h-[calc(100vh-90px)] mt-4 gap-4">
        <Card className="overflow-y-auto p-2 mb-4 max-w-[500px]">
          <h2 className="p-4 font-bold border-b text-center">Диалоги</h2>
          {!!friendIdFromUrl && !existingChat && (
            <div
              key={friend?.id}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition overflow-hidden  "bg-primary/10"`}
            >
              <Avatar className="h-13 w-13 border-2 border-primary/10 rounded-full flex items-center justify-center bg-primary/5">
                <AvatarImage
                  src={`http://192.168.1.101:3000${friend?.avatarUrl}`}
                  className="object-cover w-full h-full rounded-full"
                />
                <AvatarFallback>
                  {friend?.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="text-sm font-semibold">
                  {friend?.firstName} {friend?.lastName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {friend?.username}
                </p>
              </div>
            </div>
          )}
          {chats && chats.length > 0 && (
            <>
              {chats?.map((chat: Chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition ${currentChatId === chat.id ? "bg-primary/10" : "hover:bg-slate-50"}`}
                >
                  <Avatar className="w-13 h-13 border-2 border-primary/10 rounded-full flex items-center justify-center bg-primary/5">
                    <AvatarImage
                      src={`http://192.168.1.101:3000${chat?.friend?.avatarUrl}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                    <AvatarFallback>
                      {chat?.friend?.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-semibold">
                      {chat?.friend?.firstName} {chat?.friend?.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {chat?.friend?.username}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-destructive/20 text-destructive hover:bg-destructive/40 hover:text-destructive border border-destructive"
                      >
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Вы уверены, что хотите удалить чат?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие необратимо. Чат будет удален с сервера
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            {
                              deleteChat(chat.id);
                              setMessages([]);
                              setCurrentChatId(null);
                              setContent("");
                              if (friendIdFromUrl) {
                                navigate("/message");
                              }
                            }
                          }}
                          className="bg-destructive text-white hover:bg-destructive/30 hover:text-destructive/80 "
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </>
          )}
          {!friendIdFromUrl && chats?.length === 0 && (
            <p className="text-slate-400 mt-3">У вас нет диалогов</p>
          )}
        </Card>

        <Card className="flex-1 flex flex-col overflow-hidden mb-4">
          {currentChatId || friendIdFromUrl ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {allMessages.map((msg, idx) => {
                  const isMe = msg.senderId == currentUser?.id;
                  console.log({ isMe, msg, currentUser });
                  return (
                    <div
                      key={idx}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] w-fit break-words p-3 rounded-2xl text-xl ${isMe ? "bg-primary text-white rounded-tr-none" : "bg-slate-100 rounded-tl-none"}`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
              <div className="p-4 border-t flex items-center gap-2">
                <Textarea
                  ref={textAreaRef}
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContent(e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Введите сообщение..."
                  rows={1}
                  className="resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
                />
                <Button className="text-md" onClick={sendMessage}>
                  Отправить
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 ">
              Выберите чат, чтобы начать общение
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default MessagesPage;
