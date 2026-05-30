export interface FriendshipNote {
  id: number;
  theme: string;
  message: string;
  signature: string;
}

export interface AmazingAttribute {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface StickyWish {
  id: number;
  text: string;
  author: string;
  colorClass: string;
  rotation: string;
}
