export interface playerInfo {
    name: string,
    picture: string
};

export interface playersCoordinates {
    playerL: {x: number, y: number}, 
    playerR: {x: number, y: number}
}

export interface pladdleCoordinates {
    x: number,
    y: number
}

export interface ballCoordinates {
    x: number,
    y: number
}

export interface matchInfo {
    id: string;
    profilePic: string;
    nickname: string;
}

export type playerInfoProps = {
    style: string,
    textPos: string,
    playerInfo: playerInfo | undefined,
}
export interface MatchInfo{
    id: string;
    profilePic: string;
    nickname: string;
    opponentId: string;
    roomId: string;
}[]
