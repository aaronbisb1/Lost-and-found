
export enum ItemType {
  LOST = 'lost',
  FOUND = 'found',
}

export enum ItemStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected', 
}

export enum View {
  FEED = 'feed',
  SUBMIT = 'submit',
  ADMIN = 'admin',
  LOGIN = 'login',
  REGISTER = 'register',
  MY_ITEMS = 'my_items',
  VERIFY_EMAIL = 'verify_email',
}

export interface Item {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string; // YYYY-MM-DD
  type: ItemType;
  status: ItemStatus;
  imageUrl?: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string; // IMPORTANT: In a real app, never store hashes client-side.
  isAdmin: boolean;
  isVerified: boolean;
  confirmationCode?: string;
}

export interface Filter {
  type: 'all' | ItemType;
  location: string;
  dateSort: 'newest' | 'oldest';
  searchQuery: string;
}
