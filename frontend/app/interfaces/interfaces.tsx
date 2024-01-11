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
  BackgroundPic: string;
};

export interface AchievementsData {
  id: string;
  title: string;
  description: string;
  userScore: number;
  totalScore: number;
}[];


export interface Achievements {
  id: string;
  title: string;
  description: string;
  userScore: number;
  totalScore: number;
};

export interface responseData {
  id: string;
  profilePic: string;
  nickname: string;
};


export interface NotificationsData {
  requestId: string;
	notifData: {
		userId: string;
		userProfilePic: string;
		description: string;
		typeOfRequest: string;
		responded: boolean;
    channelName?: string;
    user?: string;
	};
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
        Wins: number;
        Losses: number;
    };
    isfriend: boolean;
    privateProfile: boolean;
    isBlocked: boolean;
};




// Chat Interfaces

export interface ChannelInter {
  channelId: string,
  channelName: string,
  channelPicture: string,
  userRole: string,
  userStatus: string,
  lastMsg: string,
  channelType: string
}

// export interface ChannelInter {
// 	id: string,
// 	channelName: string,
// 	channelPic: string,
// 	isJoined: string,
// 	channelType: string;
// 	userRole?: string;
// }


export interface DmsInter {
	dmId: string,
	name: string,
	lastMsg: string,
	picture: string
  reciverId: string,
  dmStatus?: string,
	userStatus?: string
}


// export interface DmsInter {
// 	id: string,
// 	userPic: string,
// 	userNick: string,
// }


export interface ChannelUser {
  username: string,
  userId: string,
  channelRole: string,
  userPicture: string
}

// export interface ChannelUser {
// 	id: string;
// 	userPic: string,
// 	userNick: string;
// 	userRole: string;
// }


export interface DmMessageInter {
	dmId: string,
	messageId: string,
	sender: string,
	message: string,
	time: string,
  self: string
}

export interface MessageInter {
  channelId: string,
  messageId: string,
  sender: string,
  picture: string,
  message: string,
  time: string
}

// export interface MessageInter {
// 	id: string;
// 	senderPic?: string,
// 	senderNick: string;
// 	content: string;
// 	timeStamp: string;
// }


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