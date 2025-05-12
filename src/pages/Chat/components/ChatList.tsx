import { ChatMessageType } from "@/types/chat.type";
import styles from "./chatlist.module.css";
import { UserType } from "@/types/user.type";
import ChatMessage from "./ChatMessage";

interface ChatListProps {
  messages: ChatMessageType[];
  signinedUser: UserType | null;
}

const ChatList = ({ messages, signinedUser }: ChatListProps) => {
  return (
    <main className={styles.wrapper}>
      <ul className={styles.chat_list}>
        {messages.map((message, index) => (
          <ChatMessage
            message={message}
            nickname={signinedUser?.nickname}
            key={index}
          />
        ))}
      </ul>
    </main>
  );
};

export default ChatList;
