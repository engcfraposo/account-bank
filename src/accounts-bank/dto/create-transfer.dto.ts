import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({
    description: 'Numero da conta de origem',
    default: '343-2',
  })
  account_number_source: string;

  @ApiProperty({
    description: 'Numero da conta de destino',
    default: '343-2',
  })
  @IsString()
  @IsNotEmpty()
  account_number_destination: string;

  @ApiProperty({
    description: 'Valor da transação',
    default: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
