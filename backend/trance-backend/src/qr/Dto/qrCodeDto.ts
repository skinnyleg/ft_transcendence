import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyQrCodeDto {
	@IsNotEmpty({ message: 'Code should not be empty' })
	@Transform(({ value }) => {
		if (typeof value === 'number') {
			return String(value);
		}
		return value;
	})
	@IsString({ message: 'Code should be a string' })
	@Length(6, 6, { message: 'Code should have exactly 6 characters' })
	@Matches(/^[0-9]+$/, { message: 'Code should only contain numbers' })
	code: string;
}
