import { v4 as uuidv4 } from 'uuid';

export class AccountBank {
  #id: string;
  balance: number;
  account_number: string;

  constructor(balance: number, account_number: string, id?: string) {
    this.#id = id ?? uuidv4();
    this.balance = balance;
    this.account_number = account_number;
  }

  public debit(amount: number): void {
    this.balance -= amount;
  }

  public credit(amount: number): void {
    this.balance += amount;
  }

  get id(): string {
    return this.#id;
  }
}
