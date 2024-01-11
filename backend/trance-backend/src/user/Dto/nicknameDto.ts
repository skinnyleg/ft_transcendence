import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class NicknameDto {
  @IsString({ message: 'Nickname should be a string' })
  @IsNotEmpty({ message: 'Nickname should not be empty' })
  @MinLength(2, { message: 'Nickname must be at least 2 characters long' })
  @MaxLength(10, { message: 'Nickname cannot exceed 10 characters' })
  nickname: string;
}
