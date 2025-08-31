export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ErrorResponse {
  error: string;
}

export interface SpendingByCategory {
  category: string;
  amount: number;
  transactionCount: number;
}
