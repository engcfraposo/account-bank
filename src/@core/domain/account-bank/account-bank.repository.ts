import { AccountBank } from './account-bank';

export interface AccountBankRepository {
  insert(accountBank: AccountBank): Promise<void>;
  findByAccountNumber(accountNumber: string): Promise<AccountBank | null>;
  findAll(): Promise<AccountBank[]>;
  update(accountBank: AccountBank): Promise<void>;
}
