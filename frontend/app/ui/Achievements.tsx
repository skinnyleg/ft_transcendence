'use client';
import React, { useRef, useState } from 'react';

// Sample data
const achievementsData = [
  { title: "Achievement 1", description: "Description 1", imageUrl: "../42.jpg" },
  { title: "Achievement 2", description: "Description 2", imageUrl: "../42.jpg" },
  { title: "Achievement 2", description: "Description 2", imageUrl: "../42.jpg" },
  { title: "Achievement 2", description: "Description 2", imageUrl: "../42.jpg" },
  { title: "Achievement 2", description: "Description 2", imageUrl: "../42.jpg" },
  { title: "Achievement 5", description: "Description 2", imageUrl: "../42.jpg" },
  // Add more achievements as needed
];

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

 
const Achievements = ({doneAchievements, notDoneAchievements}: AchievementsDataProps)=> {
  // const images = ['']
  return (
    <div className="bg-hardblue p-5 rounded-md lg:col-span-2 col-span-1 lg:col-start-4 lg:col-end-6 md:row-start-5 md:row-end-6 lg:row-start-1 lg:row-end-2 w-full h-[300px] shadow-md">
      <h4 className="text-xl font-bold mb-0">ACHIEVEMENTS</h4>
      <div className="flex-col space-y-4 p-4 overflow-y-scroll h-5/6 w-full styled-scrollbar">
        {doneAchievements?.map((doneAchievement) => (
          <div key={doneAchievement.id} className="bg-white flex-none p-4 border rounded flex items-center">
            <div className="flex-grow">
              <div className="font-bold">{doneAchievement.title}</div>
              <p className="text-sm text-gray-500 ml-2">
                {doneAchievement.description}</p>
            </div>
            <img src="../42.jpg" alt={`Achievement ` + doneAchievement.id} className="w-10 h-10 ml-4" />
          </div>
        ))}
</div>

    </div>
  );
};

export default Achievements;
