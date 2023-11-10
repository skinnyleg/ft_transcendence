import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeNicknameDto {
  @IsString({ message: 'Nickname should be a string' })
  @IsNotEmpty({ message: 'Nickname should not be empty' })
  nick: string;
}
