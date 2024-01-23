import { ReadonlyURLSearchParams } from "next/navigation";

export const isHidden = (searchParams: ReadonlyURLSearchParams) => {
	if (searchParams.has('channel') && searchParams.has('personal'))
		return false;
	if (searchParams.has('channel') && searchParams.get('channel') !== '')
		return true
	if (searchParams.has('personal') && searchParams.get('personal') !== '')
		return true
	return (false);
}

export const whichTab = (searchParams: ReadonlyURLSearchParams) =>  {
	if (isHidden(searchParams) === false)
		return 'none';
	if (searchParams.has('channel'))
		return 'channel';
	if (searchParams.has('personal'))
		return 'personal';
	return 'none';
}

export const checkOpenChannel = (channelName: string, searchParams: ReadonlyURLSearchParams) => {
	let channelId = '';
	if (searchParams.has('channel'))
		channelId = searchParams.get('channel') as string;
	if (channelName === channelId)
		return true;
	return false;
}

export const checkOpenChannelId = (channelName: string, channelId: string) => {
	if (channelName === channelId)
		return true;
	return false;
}

export const checkOpenPersonalId = (DmId: string, personalId: string) => {
	if (DmId === personalId)
		return true;
	return false;
}


export const isBarOpen = (searchParams: ReadonlyURLSearchParams) => {
	if (searchParams.has('bar') && searchParams.get('bar') === 'open')
		return true;
	return false;
}


export const getChannelName = (searchParams: ReadonlyURLSearchParams) => {
	if (searchParams.has('channel'))
		return (searchParams.get('channel'))
	return '';
}

export const getPersonalName = (searchParams: ReadonlyURLSearchParams) => {
	if (searchParams.has('personal'))
		return (searchParams.get('personal'))
	return '';
}