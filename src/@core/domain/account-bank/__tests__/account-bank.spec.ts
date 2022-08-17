import { AccountBank } from '../account-bank';

describe('AccountBank', () => {
  test('should create a new account', () => {
    const accountBank = new AccountBank(100, '1234-5', 'some-id');
    expect(accountBank).toBeDefined();
    expect(accountBank.id).toBe('some-id');
    expect(accountBank.balance).toBe(100);
    expect(accountBank.account_number).toBe('1234-5');
  });

  test('should debit an account', () => {
    const accountBank = new AccountBank(100, '1234-5', 'some-id');
    accountBank.debit(10);
    expect(accountBank.balance).toBe(90);
  });

  test('should credit an account', () => {
    const accountBank = new AccountBank(100, '1234-5', 'some-id');
    accountBank.credit(10);
    expect(accountBank.balance).toBe(110);
  });
});
