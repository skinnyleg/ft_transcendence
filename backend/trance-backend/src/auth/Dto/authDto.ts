import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class authDto {
	@IsNotEmpty({ message: 'Username should not be empty' })
	@IsString({ message: 'Username should be a string' })
	username: string;

	@IsNotEmpty({ message: 'Password should not be empty' })
	@Transform(({ value }) => {
		if (typeof value === 'number') {
			return String(value);
		}
		return value;
	})
	@IsString({ message: 'Password should be a string' })
	password: string;
}
