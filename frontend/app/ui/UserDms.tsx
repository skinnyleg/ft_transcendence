import type { FC } from 'react';
import { DmsInter } from '../interfaces/interfaces';
import DmComponent from './DmComponent';

const Dms: DmsInter[] = [
  {
    id: '1',
    userNick: 'General',
    userPic: '/GroupChat.png',
  },
  {
    id: '2',
    userNick: 'Random',
    userPic: '/GroupChat.png',
  },
  {
    id: '3',
    userNick: 'Random',
    userPic: '/GroupChat.png',
  },
  {
    id: '4',
    userNick: 'Random',
    userPic: '/GroupChat.png',
  },
  {
    id: '5',
    userNick: 'Random',
    userPic: '/GroupChat.png',
  },
  {
    id: '6',
    userNick: 'Random',
    userPic: '/GroupChat.png',
  },
  // Add more objects as needed...
];

interface UserDmsProps {}

const UserDms: FC<UserDmsProps> = ({}) => {
		return (
			<div className='overflow-y-auto'>
				{
					Dms.map((Dm) => (
						<DmComponent
							key={Dm.id} // Add a unique key for each child component
							Dm={Dm}
						/>
					))
				}
			</div>
	);
}
export default UserDms;
