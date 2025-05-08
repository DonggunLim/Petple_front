import styles from "./comment.module.css";
import { CommentType } from "@/types/post.type";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentType[];
}
const CommentList = ({ comments }: CommentListProps) => {
  return (
    <ul className={styles.comments_container}>
      {comments.map((comment) => (
        <CommentItem comment={comment} key={`post-comments-${comment.id}`} />
      ))}
    </ul>
  );
};

export default CommentList;
