'use client';
import TopBar from '../ui/top';
import Achievements from '../ui/Achievements';
import Themes from '../ui/Themes';
import React, { useState, useEffect } from 'react';
import PowerUps from '../ui/PowerUps';
import PlayButton from '../ui/PlayButton';
import axios from 'axios';
import FriendsList from '../ui/FriendList';
import { FaRobot } from "react-icons/fa";

import {dashboardData, profileData} from '../interfaces/interfaces';
import { QuestionMarkCircleIcon, QueueListIcon } from '@heroicons/react/24/outline';


function Dashboard() {

  const [dashboardData, setDashboardData] = useState<dashboardData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('yo1.jpg');
  const [powerup, setPowerup] = useState('FireBall');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/Dashboard', { withCredentials: true});
        console.log("Dash", response.status);
        setDashboardData(response.data);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // console.log("hello", dashboardData);
  const doneAchievements = dashboardData?.doneAchievements || [];
  const notDoneAchievements = dashboardData?.notDoneAchievements || [];
  const friends = dashboardData?.friends || [];
  const notifications = dashboardData?.notifications || [];

  const handleThemeChange = (newtheme: string) => {
    setTheme(newtheme);
  }
  const handlePowerUpChange = (newpowerup: string) => {
    setPowerup(newpowerup);
  }

  return (
    <main className="flex flex-col font-white bg-main overflow-y-hidden md:overflow-y-auto mr-2">
      <TopBar />
      <div className="flex flex-col lg:mt-10 h-[95%] md:mt-5 xl:mt-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 lg:grid-rows-3 gap-5 w-full h-full mt-4 md:grid-row-5 grid-row-5">
        
          <div className="relative p-20 rounded-md col-span-1 lg:col-span-3 h-[200px] md:h-[300px] xl:h-[370px] lg:w-full shadow-md" style={{backgroundImage: `url(${theme})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <FaRobot className="text-accents w-8 h-8 absolute right-5 top-5"/>
            <QueueListIcon className="text-accents w-8 h-8 absolute right-12 mr-2 top-5" />
            <PlayButton theme = {theme} PowerUp={powerup}/>
          </div>
          
          <Achievements
            doneAchievements={doneAchievements}
            notDoneAchievements={notDoneAchievements} />

          <Themes handleThemeChange={handleThemeChange} />
          
          <FriendsList />

          <PowerUps handlePowerUpChange={handlePowerUpChange}/>
        </div>
      </div>
    </main>
  );
}

export default (Dashboard);