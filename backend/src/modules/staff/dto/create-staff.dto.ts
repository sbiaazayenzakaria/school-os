import { IsString, IsOptional, IsEnum, IsEmail, IsArray, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty() @IsString() campusId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiProperty() @IsString() jobTitle: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['FULL_TIME','PART_TIME','PERMANENT','FIXED_TERM','SUBSTITUTE']) employmentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() qualifications?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() contractedHoursPerWeek?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() joinDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() photoUrl?: string;
}
