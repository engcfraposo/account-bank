import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountBankService } from '../@core/domain/account-bank/account-bank.service';
import { CreateAccountBankDto } from './dto/create-account-bank.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ReturnTransferDto } from './dto/return-transfer.dto';

@Controller('accounts-bank')
export class AccountsBankController {
  constructor(private readonly accountBankService: AccountBankService) {}

  @Post()
  create(@Body() createAccountBankDto: CreateAccountBankDto) {
    return this.accountBankService.create(createAccountBankDto);
  }

  @Post('transfer')
  transfer(
    @Body() createTransferDto: CreateTransferDto,
  ): Promise<ReturnTransferDto> {
    return this.accountBankService.transfer(createTransferDto);
  }

  @Get()
  findAll() {
    return this.accountBankService.findAll();
  }

  @Post('deposit')
  deposit(@Body() createMovementDto: CreateMovementDto) {
    return this.accountBankService.deposit(createMovementDto);
  }

  @Post('withdraw')
  withdraw(@Body() createMovementDto: CreateMovementDto) {
    return this.accountBankService.withdraw(createMovementDto);
  }
}
