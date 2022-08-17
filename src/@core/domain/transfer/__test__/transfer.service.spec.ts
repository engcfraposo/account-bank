import { AccountBank } from '../../account-bank/account-bank';
import { TransferService } from '../transfer.service';

describe('TransferService', () => {
  test('should transfer an amount', async () => {
    const accountSource = new AccountBank(100, '1234-5', 'some-id');
    const accountDestination = new AccountBank(100, '5678-9', 'some-id');
    const amount = 100;
    const transferService = new TransferService();

    transferService.transfer(accountSource, accountDestination, amount);

    expect(accountSource.balance).toBe(0);
    expect(accountDestination.balance).toBe(200);
  });
});
