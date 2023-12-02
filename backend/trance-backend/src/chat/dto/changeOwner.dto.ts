import { IsNotEmpty, IsString } from "class-validator";


export class changeOwner {

    @IsNotEmpty()
    @IsString()
    channelName: string;

    // @IsNotEmpty()
    // @IsString()
    // oldOwner: string;
    
    @IsNotEmpty()
    @IsString()
    newOwner: string;
}