export type AlarmType = {
  uid: number;
  content: string;
  from: {
    nickName: string;
  };
  isRead: boolean;
  createdAt: Date;
};
