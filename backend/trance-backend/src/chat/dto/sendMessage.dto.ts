import { IsNotEmpty, IsString } from "class-validator";


export class sendMessageDmDto {

    @IsNotEmpty()
    @IsString()
    receiver: string;
    
    @IsNotEmpty()
    @IsString()
    content: string;
}