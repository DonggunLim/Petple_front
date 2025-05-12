import { useNavigate } from "react-router-dom";
import styles from "./ChatHeader.module.css";
import { UserType } from "@/types/user.type";

interface ChatHeaderProps {
  targetUser: UserType;
}

const ChatHeader = ({ targetUser }: ChatHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className={styles.chat_header}>
      <div
        className={styles.back_button}
        onClick={() => navigate("/petfriends")}
      >
        <img src="/images/prev.png" alt="뒤로가기 버튼 아이콘" />
      </div>
      <h2>{targetUser.nickname}님 과의 대화방</h2>
    </div>
  );
};

export default ChatHeader;
