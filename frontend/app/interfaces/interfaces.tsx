
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

export interface AchievementsData {
  id: string;
  title: string;
  description: string;
  userScore: number;
  totalScore: number;
}[];

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
	isJoined: boolean,
}

export interface DmsInter {
	id: string,
	userPic: string,
	userNick: string,
}
