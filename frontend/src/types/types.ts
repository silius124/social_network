export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
  _count: {
    like: number;
    comment: number;
  };
  like: PostLike[];
  comment: Comment[];
}

export interface PostLike {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: number;
  parentCommentId?: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string;
  };
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  createdAt: string;
  _count: {
    post: number;
    requesterUser: number;
    receiverUser: number;
  };
  friendShipId: number;
  status: StatusFriendShip;
  requesterId: number;
}

type StatusFriendShip = "pending" | "accepted" | "rejected";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  entityId: number;
  isRead: boolean;
  createdAt: string;
}

type NotificationType =
  | "inviteToFriend"
  | "likeToPost"
  | "likeToComment"
  | "acceptInviteToFriend";

export interface PendingRequest {
  id: number;
  requestedId: number;
  receiverId: number;
  status: StatusFriendShip;
  createdAt: string;
  requesterUser: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
}

export interface Chat {
  id: number;
  updatedAt: string;
  lastMessage: Message;
  friend: User;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
}
