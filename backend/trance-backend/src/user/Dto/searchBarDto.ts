import { IsString, IsOptional } from 'class-validator';

export class searchBarDto {
	@IsString({ message: 'Input should be a string' })
	searchInput: string;
}
