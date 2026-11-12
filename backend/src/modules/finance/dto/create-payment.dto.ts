import { IsNumber, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty() @IsNumber() @Min(1) amountMinorUnits: number;
  @ApiProperty() @IsEnum(['SEPA','BANK_TRANSFER','CREDIT_CARD','CASH']) paymentMethod: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reference?: string;
}
