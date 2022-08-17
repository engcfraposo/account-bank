import { Module } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AccountBankRepository } from 'src/@core/domain/account-bank/account-bank.repository';
import { AccountBankService } from 'src/@core/domain/account-bank/account-bank.service';
import { AccountBankTypeOrmRepository } from 'src/@core/infra/db/account-bank/account-bank-typeorm.repository';
import { AccountBankSchema } from 'src/@core/infra/db/account-bank/account-bank.schema';
import { DataSource } from 'typeorm';
import { AccountsBankController } from './accounts-bank.controller';

@Module({
  imports: [],
  controllers: [AccountsBankController],
  providers: [
    {
      provide: AccountBankTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new AccountBankTypeOrmRepository(
          dataSource.getRepository(AccountBankSchema),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: AccountBankService,
      useFactory: (repo: AccountBankRepository) => {
        return new AccountBankService(repo);
      },
      inject: [AccountBankTypeOrmRepository],
    },
  ],
})
export class AccountsBankModule {}
