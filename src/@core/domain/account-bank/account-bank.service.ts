import { CreateAccountBankDto } from 'src/accounts-bank/dto/create-account-bank.dto';
import { CreateMovementDto } from 'src/accounts-bank/dto/create-movement.dto';
import { CreateTransferDto } from 'src/accounts-bank/dto/create-transfer.dto';
import { ReturnTransferDto } from 'src/accounts-bank/dto/return-transfer.dto';
import { TransferService } from '../transfer/transfer.service';
import { AccountBank } from './account-bank';
import { AccountBankRepository } from './account-bank.repository';

export class AccountBankService {
  constructor(private accountBankRepository: AccountBankRepository) {}

  async create(createAccountBankDto: CreateAccountBankDto) {
    const hasAccount = await this.accountBankRepository.findByAccountNumber(
      createAccountBankDto.account_number,
    );

    if (hasAccount) {
      throw new Error('Account already exists');
    }

    const accountBank = new AccountBank(0, createAccountBankDto.account_number);
    await this.accountBankRepository.insert(accountBank);
    return accountBank;
  }

  async findAll(): Promise<AccountBank[]> {
    return this.accountBankRepository.findAll();
  }

  async transfer(createTransferDto: CreateTransferDto) {
    const accountSource = await this.accountBankRepository.findByAccountNumber(
      createTransferDto.account_number_source,
    );
    const accountDestination =
      await this.accountBankRepository.findByAccountNumber(
        createTransferDto.account_number_destination,
      );

    if (!accountDestination || !accountSource) {
      throw new Error('Account not found');
    }

    if (this.validateSameAccount(createTransferDto)) {
      throw new Error('Accounts cannot be the same');
    }

    if (this.validateBalance(accountSource, createTransferDto.amount)) {
      throw new Error('Account source has no balance');
    }

    const transferService = new TransferService();

    transferService.transfer(
      accountSource,
      accountDestination,
      createTransferDto.amount,
    );

    await this.accountBankRepository.update(accountSource);
    await this.accountBankRepository.update(accountDestination);
    return {
      accounts: [accountSource, accountDestination],
      amount: createTransferDto.amount,
    } as ReturnTransferDto;
  }

  async deposit(createMovementDto: CreateMovementDto) {
    const account = await this.accountBankRepository.findByAccountNumber(
      createMovementDto.account_number,
    );

    if (!account) {
      throw new Error('Account not found');
    }

    account.credit(createMovementDto.amount);
    await this.accountBankRepository.update(account);
    return account;
  }

  async withdraw(createMovementDto: CreateMovementDto) {
    const account = await this.accountBankRepository.findByAccountNumber(
      createMovementDto.account_number,
    );

    if (!account) {
      throw new Error('Account not found');
    }

    if (this.validateBalance(account, createMovementDto.amount)) {
      throw new Error('Account has no balance');
    }

    account.debit(createMovementDto.amount);
    await this.accountBankRepository.update(account);
  }

  private validateBalance(account: AccountBank, amount: number) {
    return account.balance === 0 || account.balance < amount;
  }

  private validateSameAccount(transfer: CreateTransferDto) {
    return (
      transfer.account_number_source === transfer.account_number_destination
    );
  }
}
