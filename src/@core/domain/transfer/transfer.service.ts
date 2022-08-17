import { AccountBank } from '../account-bank/account-bank';

export class TransferService {
  async transfer(
    accountSource: AccountBank,
    accountDestination: AccountBank,
    amount: number,
  ) {
    accountSource.debit(amount);
    accountDestination.credit(amount);
  }
}
