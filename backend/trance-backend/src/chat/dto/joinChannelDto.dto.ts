import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class joinChannel {

    @IsNotEmpty()
    @IsString()
    channelName: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class resJoinChannel {

    @IsNotEmpty()
    @IsString()
    channelName: string;

    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsBoolean()
    value: boolean;

    @IsNotEmpty()
    @IsString()
    requestId: string
}