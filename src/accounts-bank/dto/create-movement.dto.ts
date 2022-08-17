import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovementDto {
  @ApiProperty({
    description: 'Numero da conta',
    default: '343-2',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({
    description: 'Valor da transação',
    default: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
