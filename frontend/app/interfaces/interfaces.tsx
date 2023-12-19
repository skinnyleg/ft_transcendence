import { inter } from "../ui/fonts";

export enum UserStatus {
    online = 'ONLINE',
    offline =  'OFFLINE',
    IN_GAME = 'IN_GAME'
}

export interface dashboardData {
  friends: FriendsData[];
  doneAchievements: AchievementsData[];
  notDoneAchievements: AchievementsData[];
  notifications: NotificationsData[];
}[];

export interface FriendsData {
  id: string;
  profilePic: string;
  nickname: string;
  status: UserStatus;
}[];

export interface profileNickPic{
  nickname: string;
  profilePic:string; 
};

export interface AchievementsData {
  id: string;
  title: string;
  description: string;
  userScore: number;
  totalScore: number;
}[];

export interface responseData {
  id: string;
  profilePic: string;
  nickname: string;
};


export interface NotificationsData {
  userId: string;
  userProfilePic: string;
  description: string;
  typeOfRequest: any;
  responded: boolean;
}[];

export interface profileData {
    userData: {
        id: string;
        profilePic: string;
        BackgroundPic: string;
        wallet: number;
        login: string;
        level: number | any;
        Rank: number;
        nickname: string;
        status: UserStatus;
    };
    isfriend: boolean;
    privateProfile: boolean;
};




// Chat Interfaces

export interface ChannelInter {
	id: string,
	channelName: string,
	channelPic: string,
	isJoined: string,
	channelType: string;
	userRole?: string;
}

export interface DmsInter {
	id: string,
	userPic: string,
	userNick: string,
}

export interface ChannelUser {
	id: string;
	userPic: string,
	userNick: string;
	userRole: string;
}


export interface MessageInter {
	id: string;
	senderPic?: string,
	senderNick: string;
	content: string;
	timeStamp: string;
}


export interface LeaderboardData {
  id: string;
  nickname: string;
  profilePic: string;
  Wins: number;
  Losses: number;
  winrate: number;
  Rank: number;
  self: boolean;
};