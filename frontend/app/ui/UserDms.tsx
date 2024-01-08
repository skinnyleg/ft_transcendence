import type { FC } from 'react';
import { DmsInter } from '../interfaces/interfaces';
import DmComponent from './DmComponent';


interface UserDmsProps {
	userDms: DmsInter[] | undefined;
	info: string;	
}

const UserDms: FC<UserDmsProps> = ({userDms, info}) => {
		return (
			<>
				{
				  (userDms && userDms.length > 0) && (
					userDms.map((Dm) => (
					  <DmComponent
						key={Dm.dmId} // Add a unique key for each child component
						Dm={Dm}
					  />
					))
				  )
				}
				{
					(userDms && userDms.length === 0) && (
						<div className='flex w-full h-full flex-crol justify-center items-center'>
							<p className='text-center text-lg font-bold text-teal-200'>{info}</p>
						</div>
					)
				}
			</>
	);
}
export default UserDms;
