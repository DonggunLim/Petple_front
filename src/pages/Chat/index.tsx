import styles from "./chat.module.css";
import ChatInput from "./components/ChatInput";
import ChatList from "./components/ChatList";
import useChatSocket from "./hooks/useChatSocket";
import useUserStore from "@/zustand/userStore";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPrevMessages } from "@/apis/messages.api";
import { Helmet } from "react-helmet-async";
import ChatHeader from "./components/ChatHeader";

const ChatPage = () => {
  const { nickname: targetUserNickname } = useParams();
  const { user: signinedUser } = useUserStore();
  const {
    data: { targetUser, chat },
  } = useSuspenseQuery({
    queryKey: ["prevMessage", targetUserNickname],
    queryFn: () => targetUserNickname && getPrevMessages(targetUserNickname),
    gcTime: 0,
  });
  const { messages, isConnected, sendMessage } = useChatSocket({
    signinedUser,
    preMessages: chat,
    targetUser,
  });
  return (
    isConnected && (
      <div className={styles.wrapper}>
        <Helmet>
          <title>{`${targetUser?.nickName}님과의 채팅 | PetPle`}</title>
          <meta
            name="description"
            content={`${targetUser?.nickname}님과 실시간 채팅을 즐겨보세요.!`}
          />
        </Helmet>
        <ChatHeader targetUser={targetUser} />
        <ChatList messages={messages} signinedUser={signinedUser} />
        <ChatInput sendMessage={sendMessage} />
      </div>
    )
  );
};

export default ChatPage;
