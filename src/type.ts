export type TaskType = {
  id: number;
  tag: string;
  description: string;
  comments: {
    username: string;
    comment: string;
    publishedAt: string;
  }[];
  date: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'backlog' | 'work-in-progress' | 'in-review' | 'finished';
};
