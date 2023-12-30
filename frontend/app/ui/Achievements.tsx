'use client';
import React, { useRef, useState } from 'react';

interface AchievementsDataProps{
  doneAchievements: {
    id: string;
    title: string;
    description: string;
    userScore: number;
    totalScore: number;
  }[] | undefined;
  
  notDoneAchievements: {
    id: string;
    title: string;
    description: string;
    userScore: number;
    totalScore: number;
  }[] | undefined;  
};

const imgObj: Record<string, string> = {
  "Win first match": "./42.jpg",
  "lose a match": "./yo.jpg",
  "Win five matches": "./yo1.jpg",
}


const Achievements = ({doneAchievements, notDoneAchievements}: AchievementsDataProps)=> {
  return (
    <div className="bg-accents p-5 rounded-md lg:col-span-2 col-span-1 lg:col-start-4 lg:col-end-6 md:row-start-4 md:row-end-5 lg:row-start-1 lg:row-end-2 w-full md:h-[350px] h-[350px] xl:h-[33vh] lg:h-[33vh] shadow-md">
      <h4 className="text-xl font-bold text-white mb-0">ACHIEVEMENTS</h4> 
      <div className="flex-col space-y-4 p-4 overflow-y-scroll h-5/6 lg:h-5/6 w-full styled-scrollbar">
      {/* Not done achievements */}
      {notDoneAchievements?.map((notdoneAchievement) => (
          <div key={notdoneAchievement.id} className="bg-white flex-none p-4 border rounded flex items-center py-2">
            <div className="flex-grow">
              <div className="font-bold text-[15px] lg:text-[20px]">{notdoneAchievement.title}</div>
              <p className="text-xs text-gray-500 ml-2 lg:text-sm lg:block md:block hidden">
                {notdoneAchievement.description}</p>
            </div>
            <img src={imgObj[notdoneAchievement.title]} alt={`Achievement ` + notdoneAchievement.id} className="w-10 h-10 ml-4" />
          </div>
        ))}
        {/* // Done achievements */}
        {doneAchievements?.map((doneAchievement) => (
          <div key={doneAchievement.id} className="bg-white flex-none p-4 border rounded flex items-center">
            <div className="flex-grow">
              <div className="font-bold">{doneAchievement.title}</div>
              <p className="text-sm text-gray-500 ml-2">
                {doneAchievement.description}</p>
            </div>
            <img src={imgObj[doneAchievement.title]} alt={`Achievement ` + doneAchievement.id} className="w-10 h-10 ml-4" />
          </div>
        ))}
</div>

    </div>
  );
};

export default Achievements;
