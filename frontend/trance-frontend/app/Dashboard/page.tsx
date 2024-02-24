'use client';
import TopBar from '../ui/top';
import Themes from '../ui/Themes';
import React, { useState, useEffect, useContext } from 'react';
import PowerUps from '../ui/PowerUps';
import PlayButton from '../ui/PlayButton';
import axios from 'axios';
import FriendsList from '../ui/FriendList';
import { FaRobot } from "react-icons/fa";

import {NotificationsData, dashboardData, profileData} from '../interfaces/interfaces';
import { QuestionMarkCircleIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import TopThree from '../ui/TopThree';
import { ClassNames } from '@emotion/react';
import GameType from '../game/ui/GameType';
import GamePowerUps from '../game/ui/PowerUps';
import { gameSocketContext } from '../context/gameSockets';


function Dashboard() {

  const [dashboardData, setDashboardData] = useState<dashboardData | undefined>(undefined);
  const [theme, setTheme] = useState('/yo1.jpg');
  const [powerup, setPowerup] = useState('FireBall');
  const	[gameTypes, setgameTypes] = useState<string>("BOT");
  const gameSocket = useContext(gameSocketContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Dashboard`, { withCredentials: true});
        setDashboardData(response.data);
      } catch (error) {
        toast.error('Error fetching data', {
          autoClose: 500
        });
      }
    };
    fetchData();
    gameSocket.emit('leaveGameBot');
    gameSocket.emit('leaveQueue');
  }, []);
  const doneAchievements = dashboardData?.doneAchievements || [];
  const notDoneAchievements = dashboardData?.notDoneAchievements || [];
  
  const handleThemeChange = (newtheme: string) => {
    gameSocket.emit('SaveTheme', {theme: newtheme});
    setTheme(newtheme);
  }
  const handlePowerUp = (newpowerup: string) => {
    gameSocket.emit('SavePowerUp', {powerUp: newpowerup});
    setPowerup(newpowerup);
  }

  return (
    <main className="flex flex-col font-white bg-main mr-2 h-screen">
      <TopBar />
      <div className="flex flex-col h-[95%] lg:mt-5 md:mt-10 mt-10 xl:mt-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 lg:grid-rows-3 gap-5 w-full h-full mt-4 md:grid-row-5 grid-row-5">
          <div className="relative p-0 rounded-md col-span-1 lg:col-span-3 lg:h-[100%] md:h-[300px] h-[300px] xl:h-[100%] lg:w-full shadow-md" style={{backgroundImage: `url(${theme})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <GameType typeSetter={setgameTypes}/>
            <PlayButton theme={theme} PowerUp={powerup} gameType_={gameTypes}/>
          </div>
          
          <TopThree />

          <Themes handleThemeChange={handleThemeChange} />
          
          <FriendsList />

          <GamePowerUps powerUpSetter={handlePowerUp}/>
        </div>
      </div>
    </main>
  );
}

export default (Dashboard);