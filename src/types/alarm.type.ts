export type AlarmType = {
  id: number;
  content: string;
  from: {
    profileImage: string;
    nickname: string;
  };
  isRead: boolean;
  created_at: Date;
};
