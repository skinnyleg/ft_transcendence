import { ChannelInter, ChannelUser, DmsInter, MessageInter } from "../interfaces/interfaces";

export const Messages: MessageInter[] = [
	{
		id: '1',
		senderPic: '/GroupChat.png',
		senderNick: 'Jav',
		content: 'I\'m down! Any ideas??',
		timeStamp: '11:35 AM'
	},
	{
		id: '2',
		senderPic: '/GroupChat.png',
		senderNick: 'skinnyleg',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '3',
		senderPic: '/GroupChat.png',
		senderNick: 'skinnyleg',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '4',
		senderPic: '/GroupChat.png',
		senderNick: 'med-doba',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '5',
		senderPic: '/GroupChat.png',
		senderNick: 'med-doba',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '6',
		senderPic: '/GroupChat.png',
		senderNick: 'daifi',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '7',
		senderPic: '/GroupChat.png',
		senderNick: 'daifi',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
	{
		id: '8',
		senderPic: '/GroupChat.png',
		senderNick: 'skinnyleg',
		content: 'hello',
		timeStamp: '11:35 AM'
	},
]

export const Dms: DmsInter[] = [
  {
    id: '1',
    userNick: 'General',
    userPic: '/GroupChat.png',
  },
  {
    id: '2',
    userNick: 'dom',
    userPic: '/GroupChat.png',
  },
  {
    id: '3',
    userNick: 'Ran',
    userPic: '/GroupChat.png',
  },
  {
    id: '4',
    userNick: 'Raom',
    userPic: '/GroupChat.png',
  },
  {
    id: '5',
    userNick: 'opi',
    userPic: '/GroupChat.png',
  },
  {
    id: '6',
    userNick: 'haitam',
    userPic: '/GroupChat.png',
  },
  // Add more objects as needed...
];

export const channelUsers: ChannelUser[] = [
	{
		id: '1',
		userNick: 'skinnyleg',
		userPic: '/GroupChat.png',
		userRole: 'OWNER'
	},
	{
		id: '2',
		userNick: 'doba',
		userPic: '/GroupChat.png',
		userRole: 'ADMIN'
	},
	{
		id: '3',
		userNick: 'daifi',
		userPic: '/GroupChat.png',
		userRole: 'ADMIN'
	},
	{
		id: '4',
		userNick: 'ayoub',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},

	{
		id: '5',
		userNick: 'taha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '6',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '7',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '8',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '9',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '10',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '11',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '12',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '13',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '14',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '15',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '16',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '17',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '18',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
	{
		id: '19',
		userNick: 'mustapha',
		userPic: '/GroupChat.png',
		userRole: 'MEMBER'
	},
]




export const user: ChannelUser = {
	id: '1',
	userPic: '',
	userNick: 'skinnyleg',
	userRole: '',
}

export const channels: ChannelInter[] = [
  {
    id: '1',
    channelName: 'General',
    channelPic: '/GroupChat.png',
    isJoined: true,
	userRole: 'MEMBER',
	channelType: 'PUBLIC',
  },
  {
    id: '2',
    channelName: 'Random',
    channelPic: '/GroupChat.png',
    isJoined: true,
	userRole: 'ADMIN',
	channelType: 'PUBLIC',
  },
  {
    id: '3',
    channelName: 'Rando',
    channelPic: '/GroupChat.png',
    isJoined: true,
	userRole: 'OWNER',
	channelType: 'PUBLIC',
  },
  {
    id: '4',
    channelName: 'Raom pub',
    channelPic: '/GroupChat.png',
    isJoined: false,
	channelType: 'PUBLIC',
  },
  {
    id: '5',
    channelName: 'dom prot',
    channelPic: '/GroupChat.png',
    isJoined: false,
	channelType: 'PROTECTED',
  },
  {
    id: '6',
    channelName: 'opi priv',
    channelPic: '/GroupChat.png',
    isJoined: false,
	channelType: 'PRIVATE',
  },
  // Add more objects as needed...
];
