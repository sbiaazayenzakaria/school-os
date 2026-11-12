import { IsString, IsArray, IsNumber, IsEnum, IsOptional, IsDateString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LineItemDto {
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsEnum(['TUITION','REGISTRATION','CANTEEN','TRANSPORT','EXTRACURRICULAR','OTHER']) category: string;
  @ApiProperty() @IsNumber() @Min(0) amountMinorUnits: number;
}

export class CreateInvoiceDto {
  @ApiProperty() @IsString() studentId: string;
  @ApiProperty() @IsDateString() issueDate: string;
  @ApiProperty() @IsDateString() dueDate: string;
  @ApiProperty({ default: 'EUR' }) @IsString() currency: string;
  @ApiProperty({ type: [LineItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => LineItemDto) lineItems: LineItemDto[];
}
