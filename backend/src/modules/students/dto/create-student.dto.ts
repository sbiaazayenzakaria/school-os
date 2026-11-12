import {
  IsString, IsEmail, IsOptional, IsEnum, IsDateString,
  IsArray, IsBoolean, MinLength, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty() @IsString() campusId: string;
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() preferredName?: string;
  @ApiProperty() @IsDateString() dateOfBirth: string;
  @ApiProperty() @IsEnum(['MALE','FEMALE','OTHER']) gender: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nationality?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() languagesSpoken?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() yearGroupId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() classId?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasSEN?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() senDetails?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasMedicalAlert?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() medicalAlertDetails?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() photoUrl?: string;
}
