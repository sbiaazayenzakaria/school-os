import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateStaffDto } from './create-staff.dto';
export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  @IsOptional() @IsBoolean() isActive?: boolean;
}
