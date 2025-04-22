import styles from "./chat.module.css";
import ChatInput from "./components/ChatInput";
import ChatList from "./components/ChatList";
import useChatSocket from "./hooks/useChatSocket";
import userAuthStore from "@/zustand/userAuth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPrevMessages } from "@/apis/messages.api";
import { Helmet } from "react-helmet-async";

const ChatPage = () => {
  const { nickname: targetUserNickname } = useParams();
  const navigate = useNavigate();
  const signinedUser = userAuthStore();
  const {
    data: { targetUser, chat },
  } = useSuspenseQuery({
    queryKey: ["prevMessage", targetUserNickname],
    queryFn: () => targetUserNickname && getPrevMessages(targetUserNickname),
    gcTime: 0,
  });
  const { messages, isConnected, sendMessage } = useChatSocket({
    signinedUser,
    preMessages: chat?.messages,
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
        <div className={styles.chat_header}>
          <div
            className={styles.back_button}
            onClick={() => navigate("/petfriends")}
          >
            <img src="/images/prev.png" alt="뒤로가기 버튼 아이콘" />
          </div>
          <h1>
            {targetUser.userPet[0]?.name ?? targetUser.nickName}님 과의 대화방
          </h1>
        </div>
        <ChatList messages={messages} signinedUser={signinedUser} />
        <ChatInput sendMessage={sendMessage} />
      </div>
    )
  );
};

export default ChatPage;
