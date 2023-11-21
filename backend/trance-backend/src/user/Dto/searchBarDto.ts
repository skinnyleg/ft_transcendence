import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class searchBarDto {
	@IsOptional()
	// @IsNotEmpty()
	@IsString({ message: 'Input should be a string' })
	searchInput: string;
}
