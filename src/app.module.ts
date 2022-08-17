import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountBankSchema } from './@core/infra/db/account-bank/account-bank.schema';
import { AccountsBankModule } from './accounts-bank/accounts-bank.module';

@Module({
  imports: [
    AccountsBankModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'bank.sql',
      synchronize: true,
      logging: true,
      entities: [AccountBankSchema],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
