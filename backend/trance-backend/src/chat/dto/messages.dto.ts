import { IsString, IsNotEmpty, IsOptional} from "class-validator";

export class creatMessageCh {

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsString()
    channelName: string;
}

export class sendMessageDm {

    @IsNotEmpty()
    @IsString()
    receiverId: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    content?: string;
}

export class getMessagesCH {

    @IsNotEmpty()
    @IsString()
    channelName: string;
}

export class getMessagesDm {

    @IsNotEmpty()
    @IsString()
    dmId: string;
}