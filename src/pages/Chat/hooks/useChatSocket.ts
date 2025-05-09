import { config } from "@/consts/config";
import { ChatMessageType } from "@/types/chat.type";
import { UserType } from "@/types/user.type";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseChatSocketProps {
  signinedUser: UserType | null;
  preMessages: ChatMessageType[];
  targetUser: UserType;
}

const useChatSocket = ({
  signinedUser,
  preMessages,
  targetUser,
}: UseChatSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>(
    preMessages ?? []
  );
  const socketRef = useRef<Socket>(null);

  const sendMessage = (content: string) => {
    if (!content || !roomId || !socketRef.current) return;
    socketRef.current.emit("send_message", {
      roomId,
      content,
      from: {
        id: signinedUser?.id,
        nickname: signinedUser?.nickname,
        profileImage: signinedUser?.profileImage,
        pets: signinedUser?.pets,
      },
      to: {
        id: targetUser.id,
        nickname: targetUser.nickname,
        profileImage: targetUser.profileImage,
        pets: targetUser.pets,
      },
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    const socket = io(`${config.app.backendUrl}/chat`, {
      query: {
        userId: signinedUser?.id,
        nickname: signinedUser?.nickname,
      },
      transports: ["websocket"],
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("prev_message", (messages) => {
      setMessages((prev) => [...prev, ...messages]);
    });

    socket.on("disconnect", () => setIsConnected(false));
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && signinedUser && signinedUser.id) {
      const roomId = [signinedUser.id, targetUser.id].sort().join("-");
      setRoomId(roomId);
      socketRef.current.emit("join_room", roomId);
    }
  }, []);

  return { messages, isConnected, sendMessage };
};

export default useChatSocket;
