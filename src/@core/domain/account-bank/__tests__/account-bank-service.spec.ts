import { AccountBankTypeOrmRepository } from '../../../infra/db/account-bank/account-bank-typeorm.repository';
import { AccountBankSchema } from '../../../infra/db/account-bank/account-bank.schema';
import { AccountBankService } from '../account-bank.service';
import { DataSource, Repository } from 'typeorm';

describe('AccountBankService', () => {
  let dataSource: DataSource;
  let ormRepo: Repository<AccountBankSchema>;
  let repository: AccountBankTypeOrmRepository;
  let accountBankService: AccountBankService;

  beforeEach(async () => {
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
    accountBankService = new AccountBankService(repository);

    it('should create a new account bank', async () => {
      await accountBankService.create({ account_number: '1234-5' });
      const expected = await ormRepo.findOneBy({ account_number: '1234-5' });
      expect(expected.id).toBe('some-id');
      expect(expected.balance).toBe(0);
      expect(expected.account_number).toBe('1234-5');
    });
  });
});
