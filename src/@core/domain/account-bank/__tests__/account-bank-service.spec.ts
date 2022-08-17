import { AccountBankTypeOrmRepository } from '../../../infra/db/account-bank/account-bank-typeorm.repository';
import { AccountBankSchema } from '../../../infra/db/account-bank/account-bank.schema';
import { AccountBankService } from '../account-bank.service';
import { DataSource, Repository } from 'typeorm';
import { CreateTransferDto } from 'src/accounts-bank/dto/create-transfer.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

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
  });

  it('should create a new account bank', async () => {
    await accountBankService.create({ account_number: '1234-5' });
    const expected = await ormRepo.findOneBy({ account_number: '1234-5' });
    expect(expected.id).not.toBeNull();
    expect(expected.balance).toBe(0);
    expect(expected.account_number).toBe('1234-5');
  });

  it('should transfer an amount', async () => {
    const accountSource = await accountBankService.create({
      account_number: '1234-5',
    });

    const accountDestination = await accountBankService.create({
      account_number: '5678-9',
    });

    await accountBankService.deposit({ account_number: '1234-5', amount: 100 });

    const amount = 100;

    const createTransfer: CreateTransferDto = {
      account_number_source: accountSource.account_number,
      account_number_destination: accountDestination.account_number,
      amount,
    };

    const received = await accountBankService.transfer(createTransfer);

    expect(received.accounts[0].account_number).toBe(
      accountSource.account_number,
    );
    expect(received.accounts[0].balance).toBe(0);
    expect(received.accounts[1].account_number).toBe(
      accountDestination.account_number,
    );
    expect(received.accounts[1].balance).toBe(100);
    expect(received.amount).toBe(amount);
  });

  it('should deposit an amount', async () => {
    const account = await accountBankService.create({
      account_number: '1234-5',
    });

    await accountBankService.deposit({ account_number: '1234-5', amount: 100 });

    const expected = await ormRepo.findOneBy({ account_number: '1234-5' });
    expect(expected.id).not.toBeNull();
    expect(expected.balance).toBe(100);
    expect(expected.account_number).toBe(account.account_number);
  });

  it('should withdraw an amount', async () => {
    const account = await accountBankService.create({
      account_number: '1234-5',
    });

    await accountBankService.deposit({ account_number: '1234-5', amount: 100 });
    await accountBankService.withdraw({ account_number: '1234-5', amount: 50 });

    const expected = await ormRepo.findOneBy({ account_number: '1234-5' });
    expect(expected.id).not.toBeNull();
    expect(expected.balance).toBe(50);
    expect(expected.account_number).toBe(account.account_number);
  });

  it('should find all accounts', async () => {
    await accountBankService.create({ account_number: '1234-5' });
    await accountBankService.create({ account_number: '5678-9' });
    const expected = await accountBankService.findAll();
    expect(expected.length).toBe(2);
  });

  it("withdraw - should throw an error if the account doesn't exist", async () => {
    await expect(
      accountBankService.withdraw({ account_number: '1234-5', amount: 50 }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it("withdraw - should throw an error if the account doesn't have enough balance", async () => {
    await accountBankService.create({ account_number: '1234-5' });
    await expect(
      accountBankService.withdraw({ account_number: '1234-5', amount: 50 }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Account has no balance',
        },
        HttpStatus.NOT_ACCEPTABLE,
      ),
    );
  });

  it('deposit - should throw an error if the account does not exist', async () => {
    await expect(
      accountBankService.deposit({ account_number: '1234-5', amount: 50 }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('transfer - should throw an error if the account does not exist', async () => {
    await expect(
      accountBankService.transfer({
        account_number_source: '1234-5',
        account_number_destination: '5678-9',
        amount: 50,
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('transfer - should throw an error if the account source does not exist', async () => {
    await accountBankService.create({ account_number: '5678-9' });
    await expect(
      accountBankService.transfer({
        account_number_source: '1234-5',
        account_number_destination: '5678-9',
        amount: 50,
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('transfer - should throw an error if the account does not have enough balance', async () => {
    await accountBankService.create({ account_number: '1234-5' });
    await expect(
      accountBankService.transfer({
        account_number_source: '1234-5',
        account_number_destination: '5678-9',
        amount: 50,
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Account source has no balance',
        },
        HttpStatus.NOT_ACCEPTABLE,
      ),
    );
  });

  it('transfer - should throw an error if the account destination does not exist', async () => {
    await accountBankService.create({ account_number: '1234-5' });
    await expect(
      accountBankService.transfer({
        account_number_source: '1234-5',
        account_number_destination: '5678-9',
        amount: 50,
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('transfer - should throw an error with source account and destination account is the same', async () => {
    await accountBankService.create({ account_number: '1234-5' });
    await expect(
      accountBankService.transfer({
        account_number_source: '1234-5',
        account_number_destination: '1234-5',
        amount: 50,
      }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Accounts cannot be the same',
        },
        HttpStatus.FORBIDDEN,
      ),
    );
  });

  it('create - should throw an error if the account exist', async () => {
    await accountBankService.create({ account_number: '1234-5' });
    await expect(
      accountBankService.create({ account_number: '1234-5' }),
    ).rejects.toThrow(
      new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });
});
