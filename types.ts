
import { ROOMMATES } from './constants';

export type Roommate = typeof ROOMMATES[number];

export interface Expense {
  id: string;
  paidBy: Roommate;
  amount: number;
  description: string;
  date: string;
}

export type Tab = 'add' | 'history' | 'balance';

export interface Balance {
    name: Roommate;
    balance: number;
}
