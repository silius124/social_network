import { Container } from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useChatMessages, useChats } from "@/features/chat/chat.hooks";
import { getSocket } from "@/features/chat/socket.service";
import type { Chat, Message } from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";

function MessagesPage() {
  const { token, user: currentUser } = useAuthStore();
  const { data: chats } = useChats();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [content, setContent] = useState<string>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { data: history } = useChatMessages(currentChatId);

  const allMessages = useMemo<Message[]>(
    () => [...(history || []), ...messages],
    [history, messages],
  );

  useEffect(() => {
    if (!token || !currentChatId) return;

    const socket = getSocket(token);

    socket.emit("joinRoom", { chatId: currentChatId });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
      setMessages([]);
    };
  }, [token, currentChatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const sendMessage = () => {
    if (!token || !content?.trim() || !currentChatId) return;

    const socket = getSocket(token);
    socket.emit("sendMessage", { chatId: currentChatId, content });
    setContent("");
  };

  return (
    <Container>
      <div className="flex h-[calc(100-80px)] mt-4 gap-4">
        <Card className="w-1/3 overflow-y-auto p-2">
          <h2 className="p-4 font-bold border-b">Диалоги</h2>
          {chats?.map((chat: Chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition ${currentChatId === chat.id ? "bg-primary/10" : "hover:bg-slate-50"}`}
            >
              <Avatar>
                <AvatarImage
                  src={`http://localhost:3000${chat?.friend?.avatarUrl}`}
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
            </div>
          ))}
        </Card>

        <Card className="flex-1 flex flex-col overflow-hidden">
          {currentChatId ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {allMessages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={idx}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? "bg-primary text-white rounded-tr-none" : "bg-slate-100 rounded-tl-none"}`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContent(e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent) =>
                    e.key === "Enter" && sendMessage()
                  }
                  placeholder="Введите сообщение..."
                />
                <Button onClick={sendMessage}>Отправить</Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 ">
              Выберите чат, чтобы начать общение
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}

export default MessagesPage;
