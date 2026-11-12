import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsOptional()
  @IsEnum(['APPLICANT','ADMITTED','ENROLLED','ACTIVE','ON_LEAVE','TRANSFERRED','GRADUATED','ARCHIVED','WITHDRAWN'])
  status?: string;
}
