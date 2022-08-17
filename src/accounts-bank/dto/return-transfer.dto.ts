import { ApiProperty } from '@nestjs/swagger';
import { AccountBank } from '../../@core/domain/account-bank/account-bank';

export class ReturnTransferDto {
  @ApiProperty({
    description: 'contas envolvidas na transação',
    default: [new AccountBank(100, '3434-2'), new AccountBank(100, '3433-2')],
    type: [AccountBank],
  })
  accounts: AccountBank[];

  @ApiProperty({
    description: 'Valor da transação',
    default: 100,
  })
  amount: number;
}
