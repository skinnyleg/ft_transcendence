'use client';
import React, { useEffect, useRef, useState } from 'react';
import { LeaderboardData } from '../interfaces/interfaces';
import GoldMedal from "../../public/GoldMedal.svg";
import SilverMedal from "../../public/SilverMedal.svg";
import BronzeMedal from "../../public/BronzeMedal.svg";
import Image from 'next/image';

const medals = [
  GoldMedal,
  SilverMedal,
  BronzeMedal
]

const TopThree = ()=> {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([])
  let count: number = 0;

  const getLeaderboard = async () => {
		let data;
		try {
				const leaderboard = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Leaderboard`, {
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
        <div key={index} className="flex flex-row p-2 rounded-[15px] w-full mb-0 h-[30%] items-center py-0 bg-cyan-600">
        <div className="flex-grow flex flex-row items-center justify-between">
          <div className='flex flex-row items-center gap-4'>
            <img src='/yo.jpg' alt={`user Picture ` + index} className="w-10 h-10 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-[15px]" />
            <div className="text-[15px] md:text-[25px] lg:text-[35px] font-semibold">Unknown</div>
          </div>
          <div className='w-fit h-fit'>
            {/* <img src={medals[index]} alt={`medal` + (index)} className='w-11 h-12 rounded-[15px]'/> */}
            <Image
              priority
              src={medals[index]}
              alt={`medal` + (index)}
            />
          </div>
        </div>
      </div>
      )
    }
    return jsxElements;
  }

  return (
    <div className=" p-0 rounded-md lg:col-span-2  col-span-1 lg:col-start-4 lg:col-end-6 md:row-start-4 md:row-end-5 lg:row-start-1 lg:row-end-2 w-full md:h-[350px] h-[350px] xl:h-[100%] lg:h-[100%]">
      {/* <h4 className="text-xl font-bold text-white mb-0">LEADERBOARD</h4>  */}
      <div className="flex flex-col  p-0   h-full  w-full justify-between gap-0">

        {
          leaderboardData.length > 0 && leaderboardData.slice(0, 3).map((userRank, index) => {
            count++;
            return (
              <div key={userRank.id} className="flex flex-row p-2 rounded-[15px] w-full mb-0 h-[30%] items-center py-0 bg-cyan-600">
              <div className="flex-grow flex flex-row items-center justify-between">
                <div className='flex flex-row items-center gap-4'>
                  <img src={userRank.profilePic} alt={`user Picture ` + userRank.id} className="w-10 h-10 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-[15px]"/>
                  <div className="text-[15px] md:text-[25px] lg:text-[35px] font-semibold">{userRank.nickname}</div>
                </div>
                <div className='w-fit h-fit'>
                  {/* <img src={medals[index]} alt={`medal` + (index)} className='w-11 h-12 rounded-[15px]'/> */}
                  <Image
                    priority
                    src={medals[index]}
                    alt={`medal` + (index)}
                  />
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
</div>

    </div>
  );
};

export default TopThree;
