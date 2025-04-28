import { config } from "@/consts/config";
import { ChatMessageType } from "@/types/chat.type";
import { AuthStore, UserType } from "@/types/user.type";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseChatSocketProps {
  signinedUser: AuthStore;
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

  const sendMessage = (text: string) => {
    if (!text || !roomId || !socketRef.current) return;
    socketRef.current.emit("send_message", {
      roomId,
      text,
      from: {
        id: signinedUser.userId,
        nickName: signinedUser.userNickName,
        userPet: signinedUser.userPet,
        profileImage: signinedUser.userImage,
      },
      to: {
        id: targetUser._id,
        nickName: targetUser.nickName,
        userPet: targetUser.userPet,
        profileImage: targetUser.profileImage,
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
        userId: signinedUser.userId,
        nickname: signinedUser.userNickName,
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
    if (socketRef.current && signinedUser && signinedUser.userId) {
      const roomId = [signinedUser.userId, targetUser._id].sort().join("-");
      setRoomId(roomId);
      socketRef.current.emit("join_room", roomId);
    }
  }, []);

  return { messages, isConnected, sendMessage };
};

export default useChatSocket;
