import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";

enum    channelType {
    PUBLIC = 'PUBLIC',
    PROTECTED = 'PROTECTED',
    PRIVATE = 'PRIVATE'
}

export class creatChannel {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    picture?: string;
  
    @IsEnum(channelType)
    type: string;
  
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password?: string;
}