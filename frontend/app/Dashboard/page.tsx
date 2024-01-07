'use client';
import TopBar from '../ui/top';
import Themes from '../ui/Themes';
import React, { useState, useEffect } from 'react';
import PowerUps from '../ui/PowerUps';
import PlayButton from '../ui/PlayButton';
import axios from 'axios';
import FriendsList from '../ui/FriendList';
import { FaRobot } from "react-icons/fa";

import {dashboardData, profileData} from '../interfaces/interfaces';
import { QuestionMarkCircleIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import TopThree from '../ui/TopThree';


function Dashboard() {

  const [dashboardData, setDashboardData] = useState<dashboardData | undefined>(undefined);
  const [theme, setTheme] = useState('yo1.jpg');
  const [powerup, setPowerup] = useState('FireBall');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Dashboard', { withCredentials: true});
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Dashboard`, { withCredentials: true});
        console.log("Dash", response.status);
        setDashboardData(response.data);
      } catch (error) {
        console.log('error == ', error);
        toast.error('Error fetching data', {
          autoClose: 500
        });
      }
    };

    fetchData();
  }, []);
  const doneAchievements = dashboardData?.doneAchievements || [];
  const notDoneAchievements = dashboardData?.notDoneAchievements || [];
  
  const handleThemeChange = (newtheme: string) => {
    setTheme(newtheme);
  }
  const handlePowerUpChange = (newpowerup: string) => {
    setPowerup(newpowerup);
  }

  return (
    <main className="flex flex-col font-white bg-main mr-2">
      <TopBar />
      <div className="flex flex-col h-[95%] lg:mt-5  md:mt-10 mt-10 xl:mt-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 lg:grid-rows-3 gap-3 w-full h-full mt-4 md:grid-row-5 grid-row-5">
          <div className="relative p-0 rounded-md col-span-1 lg:col-span-3 lg:h-[250px] md:h-[300px] h-[300px] xl:h-[250px] lg:w-full shadow-md" style={{backgroundImage: `url(${theme})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <FaRobot className="text-accents w-8 h-8 absolute right-5 top-5"/>
            <QueueListIcon className="text-accents w-8 h-8 absolute right-12 mr-2 top-5" />
            <PlayButton theme = {theme} PowerUp={powerup}/>
          </div>
          
          <TopThree />

          <Themes handleThemeChange={handleThemeChange} />
          
          <FriendsList />

          <PowerUps handlePowerUpChange={handlePowerUpChange}/>
        </div>
      </div>
    </main>
  );
}

export default (Dashboard);