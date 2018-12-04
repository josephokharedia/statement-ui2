export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: Number;
  balance: Number;
  categories: string[];
  statement: StatementSummary;
}

export interface Category {
  _id?: string;
  name?: string;
  tags?: string[];
  color?: string;
}

export interface TransactionResult {
  count: number;
  data: Transaction[];
}

export interface StatementSummary {
  id?: string;
  institution?: string;
  accountNumber?: string;
  accountDescription?: string;
}

export interface Statement {
  id?: string;
  institution?: string;
  accountNumber?: string;
  accountDescription?: string;
  fromDate?: Date;
  toDate?: Date;
  openingBalance?: number;
  closingBalance?: number;
  totalCredit?: number;
  totalDebit?: number;
  statementNumber?: string;
}

export interface StatementTransaction {
  _id: string;
  date: Date;
  description: string;
  amount: number;
  balance: number;
}

export interface StatementTransactions {
  credits: StatementTransaction[];
  debits: StatementTransaction[];
  data: StatementTransaction[];
}

export interface StatementDetails {
  id?: string;
  institution?: string;
  accountNumber?: string;
  accountDescription?: string;
  fromDate: Date;
  toDate: Date;
  openingBalance: number;
  closingBalance: number;
  totalCredit: number;
  totalDebit: number;
  statementNumber: string;
  transactions: StatementTransactions;
}

export interface AppError {
  message: string;
  detail?: string;
  dismissable?: boolean;
}

export interface CategoriesTotal {
  id: string;
  name: string;
  count: number;
  amount: number;
}
