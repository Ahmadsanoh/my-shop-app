// src/app/dev/user.model.ts

export interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderSummary {
  id: string;
  date: string;
  status: string;
  total: number;
}

export interface UserPreferences {
  newsletter: boolean;
  defaultMinRating?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  defaultAddress?: Address;
  preferences: UserPreferences;
  orders: OrderSummary[];
}
