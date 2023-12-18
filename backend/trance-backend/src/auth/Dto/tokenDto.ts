import { IsString } from 'class-validator';

export class tokenDto {
	@IsString({ message: 'token should be a string' })
	token: string;
}
