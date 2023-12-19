import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class sendMessageDmDto {

    @IsNotEmpty()
    @IsString()
    receiver: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    content?: string;
}