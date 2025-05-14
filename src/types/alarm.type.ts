export type AlarmType = {
  id: number;
  content: string;
  from: {
    profileImage: string;
    nickname: string;
  };
  is_read: boolean;
  created_at: Date;
};
