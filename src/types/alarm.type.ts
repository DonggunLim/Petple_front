export type AlarmType = {
  uid: number;
  content: string;
  from: {
    profileImage: string;
    nickName: string;
  };
  isRead: boolean;
  createdAt: Date;
};
