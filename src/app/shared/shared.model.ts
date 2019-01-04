import * as moment from 'moment';

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
  id?: string;
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
  statementNumber?: string;
  accountDescription?: string;
}

export interface StatementTo {
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
  id?: string;
  date: Date;
  description: string;
  amount: number;
  balance: number;
  duplicate?: boolean;
}

export interface TransactionGroups {
  credits: StatementTransaction[];
  debits: StatementTransaction[];
  data: StatementTransaction[];
}

export interface StatementDetailsTo {
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
  transactionGroups: TransactionGroups;
}

export interface CategoriesTotal {
  id: string;
  name: string;
  count: number;
  amount: number;
}

export enum AppErrorType {
  OFFLINE_ERROR = 'OFFLINE',
  HTTP_ERROR = 'HTTP_ERROR',
  TECHNICAL_ERROR = 'TECHNICAL_ERROR'
}

export class AppError {
  static readonly MAX_ERROR_MESSAGE_LENGTH = 200;
  private readonly _type: AppErrorType;
  private readonly _timestamp: string;
  private _url: string;
  private _statusCode: string;
  private _statusText: string;
  private _error: string;
  private _possibleReason: string;

  constructor(type: AppErrorType = AppErrorType.TECHNICAL_ERROR) {
    this._type = type;
    this._timestamp = moment.utc().toString();
  }

  get type() {
    return this._type;
  }

  get timestamp() {
    return this._timestamp;
  }

  set url(url: string) {
    this._url = AppError.truncate(url);
  }

  get url() {
    return this._url;
  }

  set statusCode(statusCode: string) {
    this._statusCode = AppError.truncate(statusCode);
  }

  get statusCode() {
    return this._statusCode;
  }

  set statusText(statusText: string) {
    this._statusText = AppError.truncate(statusText);
  }

  get statusText() {
    return this._statusText;
  }

  set error(error: string) {
    this._error = AppError.truncate(error);
  }

  get error() {
    return this._error;
  }

  set possibleReason(possibleReason: string) {
    this._possibleReason = AppError.truncate(possibleReason);
  }

  get possibleReason() {
    return this._possibleReason;
  }


  private static truncate(str) {
    if (!str) {
      return str;
    }
    if (str.length > AppError.MAX_ERROR_MESSAGE_LENGTH) {
      return `${str.substring(0, AppError.MAX_ERROR_MESSAGE_LENGTH)}...`;
    } else {
      return str;
    }
  }
}

export interface InstitutionTo {
  name: string;
}

export interface StatementDraftTo {
  id: string;
  institution: string;
  filename: string;
  statement: StatementSummary;
  transactions: StatementTransaction[];
  fromDate: Date;
  toDate: Date;
}
