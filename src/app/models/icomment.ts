export interface IComment {
    id?: string;
    articleId: string;
    userId: string;
    username: string;
    content: string;
    parentId?: string | null;
    timestamp: number;
    likes: number;
    replies?: IComment[];
  }
  