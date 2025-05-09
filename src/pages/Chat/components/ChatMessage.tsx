import { ChatMessageType } from "@/types/chat.type";
import styles from "./chatmessage.module.css";
import { useMemo } from "react";
import { Avartar } from "@/components";

interface ChatMessageProps {
  message: ChatMessageType;
  nickname?: string | null;
}

const ChatMessage = ({ message, nickname }: ChatMessageProps) => {
  const isMyMessage = useMemo(
    () => message.from.nickname === nickname,
    [message.from, nickname]
  );

  return isMyMessage ? (
    <MyMessage message={message} />
  ) : (
    <OtherMessage message={message} />
  );
};

export default ChatMessage;

const MyMessage = ({ message }: { message: ChatMessageType }) => {
  return <li className={styles.my_message_wrapper}>{message.content}</li>;
};

const OtherMessage = ({ message }: { message: ChatMessageType }) => {
  return (
    <li className={styles.other_message_wrapper}>
      <div className={styles.profile_container}>
        <Avartar
          image={message.from.pets[0]?.image || message.from.profileImage}
          className={styles.profile_image}
        />
      </div>
      <div className={styles.message_content}>
        <span className={styles.nickname}>
          {message.from.pets[0]?.name || message.from.nickname}
        </span>
        <p className={styles.message_text}>{message.content}</p>
      </div>
    </li>
  );
};
