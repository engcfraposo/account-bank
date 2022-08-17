import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountBankDto {
  @ApiProperty({
    description: 'Numero da conta',
    default: '343-2',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;
}
