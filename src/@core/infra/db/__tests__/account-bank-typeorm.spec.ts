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

    it('should insert an account bank', async () => {
      const accountBank = new AccountBank(100, '1234-5');
      await repository.insert(accountBank);
      const expected = await ormRepo.findOneBy({ account_number: '1234-5' });
      expect(expected.id).toBe('some-id');
      expect(expected.balance).toBe(100);
      expect(expected.account_number).toBe('1234-5');
    });
  });
});
