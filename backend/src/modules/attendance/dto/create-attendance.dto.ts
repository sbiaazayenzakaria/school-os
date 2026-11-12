import { IsString, IsEnum, IsOptional, IsArray, IsDateString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty() @IsString() studentId: string;
  @ApiProperty() @IsString() classId: string;
  @ApiProperty() @IsDateString() date: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() period?: number;
  @ApiProperty() @IsEnum(['PRESENT','ABSENT_UNEXCUSED','ABSENT_EXCUSED','LATE','MEDICAL']) status: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class BulkAttendanceDto {
  @ApiProperty({ type: [CreateAttendanceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceDto)
  records: CreateAttendanceDto[];
}
