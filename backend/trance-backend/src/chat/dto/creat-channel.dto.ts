import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";

enum    channelType {
    PUBLIC = 'public',
    PROTECTED = 'protected',
    PRIVATE = 'private'
}

export class creatChannelDto {

    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsEnum(channelType)
    type: string;
  
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password?: string;
}