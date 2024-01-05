'use client';
import React, { useEffect, useRef, useState } from 'react';
import { LeaderboardData } from '../interfaces/interfaces';

const medals = [
  '/goldMedalNo.png',
  '/silverMedalNo.png',
  '/bronzeMedalNo.png'
]

const TopThree = ()=> {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([])
  let count: number = 0;

  const getLeaderboard = async () => {
		let data;
		try {
				const leaderboard = await fetch('http://localhost:8000/user/Leaderboard', {
				method: 'GET',
				credentials: 'include',
				headers:{'Content-Type': 'application/json',
				}
			});
			data = await leaderboard.json();
			setLeaderboardData(data);
		}
		catch (error)
		{
			console.log("error1 == ", error);
		}
		return data;
	}


	useEffect(() => {
		getLeaderboard();
	}, [])

  const renderIncongnito = (count : number) => {
    const jsxElements = [];
    for (let index = count; index < 3; index++) {
      jsxElements.push(
        <div key={index} className="flex flex-row p-2 rounded-[15px] w-full mb-0 h-1/3 items-center py-0 bg-cyan-600">
        <div className="flex-grow flex flex-row items-center justify-between">
          <div className='flex flex-row items-center gap-2'>
            <img src='/yo.jpg' alt={`user Picture ` + index} className="w-16 h-16 rounded-[15px] " />
            <div className="font-bold text-[15px] lg:text-[20px] ">Unknown</div>
          </div>
          <div className='w-fit h-fit'>
            <img src={medals[index]} alt={`medal` + (index)} className='w-11 h-12 rounded-[15px]'/>
          </div>
        </div>
      </div>
      )
    }
    return jsxElements;
  }

  return (
    <div className=" p-0 rounded-md lg:col-span-2  col-span-1 lg:col-start-4 lg:col-end-6 md:row-start-4 md:row-end-5 lg:row-start-1 lg:row-end-2 w-full md:h-[350px] h-[350px] xl:h-[33vh] lg:h-[33vh] shadow-md">
      {/* <h4 className="text-xl font-bold text-white mb-0">LEADERBOARD</h4>  */}
      <div className="flex flex-col  p-4  h-full  w-full justify-between gap-2">

        {
          leaderboardData.slice(0, 3).map((userRank, index) => {
            count++;
            return (
              <div key={userRank.id} className="flex flex-row p-2 rounded-[15px] w-full mb-0 h-1/3 items-center py-0 bg-cyan-600">
              <div className="flex-grow flex flex-row items-center justify-between">
                <div className='flex flex-row items-center gap-4'>
                  <img src={userRank.profilePic} alt={`user Picture ` + userRank.id} className="w-16 h-16 rounded-[15px] " />
                  <div className=" text-[35px] font-semibold ">{userRank.nickname}</div>
                </div>
                <div className='w-fit h-fit'>
                  <img src={medals[index]} alt={`medal` + (index)} className='w-11 h-12 rounded-[15px]'/>
                </div>
              </div>
            </div>
            )
          })
        }

        {renderIncongnito(count).map((jsxElement) => {
          return (
            jsxElement
          )
        })}
      {/* Not done achievements */}
      {/* {notDoneAchievements?.map((notdoneAchievement) => (
          <div key={notdoneAchievement.id} className="bg-white flex-none p-4 border rounded flex items-center py-2">
            <div className="flex-grow">
              <div className="font-bold text-[15px] lg:text-[20px]">{notdoneAchievement.title}</div>
              <p className="text-xs text-gray-500 ml-2 lg:text-sm lg:block md:block hidden">
                {notdoneAchievement.description}</p>
            </div>
            <img src={imgObj[notdoneAchievement.title]} alt={`Achievement ` + notdoneAchievement.id} className="w-10 h-10 ml-4" />
          </div>
        ))} */}
        {/* // Done achievements */}
        {/* {doneAchievements?.map((doneAchievement) => (
          <div key={doneAchievement.id} className="bg-white flex-none p-4 border rounded flex items-center">
            <div className="flex-grow">
              <div className="font-bold">{doneAchievement.title}</div>
              <p className="text-sm text-gray-500 ml-2">
                {doneAchievement.description}</p>
            </div>
            <img src={imgObj[doneAchievement.title]} alt={`Achievement ` + doneAchievement.id} className="w-10 h-10 ml-4" />
          </div>
        ))} */}
</div>

    </div>
  );
};

export default TopThree;
