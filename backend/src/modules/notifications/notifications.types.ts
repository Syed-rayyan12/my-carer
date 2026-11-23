export type Notification = {
  id: string;
  title: string;
  kind: 'message' | 'verified' | 'registration' | 'job' | 'review' | 'account';
  time: Date;
  href: string;
  read: boolean;
  dismissed: boolean;
};
