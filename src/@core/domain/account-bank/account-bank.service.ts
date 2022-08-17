import { HttpException, HttpStatus } from '@nestjs/common';
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
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Account already exists',
        },
        HttpStatus.FORBIDDEN,
      );
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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (this.validateSameAccount(createTransferDto)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Accounts cannot be the same',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (this.validateBalance(accountSource, createTransferDto.amount)) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Account source has no balance',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      );
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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Account not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (this.validateBalance(account, createMovementDto.amount)) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Account has no balance',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
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
