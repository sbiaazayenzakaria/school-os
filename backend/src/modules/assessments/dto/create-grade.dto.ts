import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty() @IsString() studentId: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() rawScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['EXCEEDING','SECURE','DEVELOPING','EMERGING']) competencyLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() narrativeComment?: string;
}
