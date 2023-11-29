import { IsString, IsNotEmpty } from 'class-validator';

export class NicknameDto {
  @IsString({ message: 'Nickname should be a string' })
  @IsNotEmpty({ message: 'Nickname should not be empty' })
  nickname: string;
}
