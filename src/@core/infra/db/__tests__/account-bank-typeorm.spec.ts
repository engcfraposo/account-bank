import { AccountBank } from '../../../domain/account-bank/account-bank';
import { DataSource, Repository } from 'typeorm';
import { AccountBankTypeOrmRepository } from '../account-bank/account-bank-typeorm.repository';
import { AccountBankSchema } from '../account-bank/account-bank.schema';

describe('AccountBankTypeOrmRepository', () => {
  let dataSource: DataSource;
  let ormRepo: Repository<AccountBankSchema>;
  let repository: AccountBankTypeOrmRepository;

  beforeEach(async (): Promise<void> => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: true,
      entities: [AccountBankSchema],
    });

    await dataSource.initialize();
    ormRepo = dataSource.getRepository(AccountBankSchema);
    repository = new AccountBankTypeOrmRepository(ormRepo);
  });

  it('should insert an account bank', async () => {
    const accountBank = new AccountBank(100, '1234-5', 'some-id');
    await repository.insert(accountBank);
    const received = await ormRepo.findOneBy({ account_number: '1234-5' });
    expect(received.id).toBe('some-id');
    expect(received.balance).toBe(100);
    expect(received.account_number).toBe('1234-5');
  });

  it('should find an account bank by account number', async () => {
    const accountBank = new AccountBank(100, '1234-5', 'some-id');
    await repository.insert(accountBank);
    const received = await repository.findByAccountNumber('1234-5');
    expect(received.id).toBe('some-id');
    expect(received.balance).toBe(100);
    expect(received.account_number).toBe('1234-5');
  });

  it('should find all accounts bank', async () => {
    const accountBank = new AccountBank(100, '1234-5', 'some-id');
    await repository.insert(accountBank);
    const received = await repository.findAll();
    expect(received.length).toBe(1);
    expect(received[0].id).toBe('some-id');
    expect(received[0].balance).toBe(100);
    expect(received[0].account_number).toBe('1234-5');
  });
});
