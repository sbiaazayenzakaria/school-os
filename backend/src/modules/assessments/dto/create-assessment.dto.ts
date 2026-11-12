import { IsString, IsEnum, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssessmentDto {
  @ApiProperty() @IsString() campusId: string;
  @ApiProperty() @IsString() classId: string;
  @ApiProperty() @IsString() subjectId: string;
  @ApiProperty() @IsString() termId: string;
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsEnum(['HOMEWORK','QUIZ','TEST','MIDTERM','FINAL','ORAL','PROJECT']) type: string;
  @ApiProperty() @IsDateString() date: string;
  @ApiProperty() @IsNumber() @Min(1) @Max(1000) maxScore: number;
  @ApiProperty() @IsNumber() @Min(0) @Max(10) weight: number;
  @ApiProperty() @IsEnum(['PRIMARY_COMPETENCY','GERMAN_SCALE','FRENCH_SCALE','PERCENTAGE','LETTER_GRADE','CUSTOM']) gradingSystem: string;
}
