import type { FC } from 'react';
import { DmsInter } from '../interfaces/interfaces';
import DmComponent from './DmComponent';
import { Dms } from './ChatConstants';


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
