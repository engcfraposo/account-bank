import { AccountBank } from '../../../domain/account-bank/account-bank';
import { Repository } from 'typeorm';
import { AccountBankRepository } from '../../../domain/account-bank/account-bank.repository';
import { AccountBankSchema } from './account-bank.schema';

export class AccountBankTypeOrmRepository implements AccountBankRepository {
  constructor(private readonly ormRepo: Repository<AccountBankSchema>) {}

  async insert(accountBank: AccountBank): Promise<void> {
    console.log(accountBank);
    const model = this.ormRepo.create(accountBank);
    await this.ormRepo.insert(model);
  }

  async findByAccountNumber(accountNumber: string): Promise<AccountBank> {
    try {
      const model = await this.ormRepo.findOneBy({
        account_number: accountNumber,
      });
      return new AccountBank(model.balance, model.account_number, model.id);
    } catch (error) {
      return null;
    }
  }

  async update(accountBank: AccountBank): Promise<void> {
    await this.ormRepo.update(accountBank.id, accountBank);
  }

  async findAll(): Promise<AccountBank[]> {
    const models = await this.ormRepo.find();
    return models.map(
      (model) => new AccountBank(model.balance, model.account_number, model.id),
    );
  }
}
