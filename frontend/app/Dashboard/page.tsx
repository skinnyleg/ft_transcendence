'use client';
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NavBar from '../ui/navBar';
import { BellAlertIcon, MagnifyingGlassCircleIcon, PlayIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import TopBar from '../ui/top';
import Achievements from '../ui/Achievements';
import Themes from '../ui/Themes';
import React, { useState, useEffect } from 'react';
import PowerUps from '../ui/PowerUps';
import PlayButton from '../ui/PlayButton';
// import withAuth from '../withAuth';
import useSWR from 'swr';

import axios from 'axios';

interface dashboardData {
  friends: FriendsData[];
  doneAchievements: AchievementsData[];
  notDoneAchievements: AchievementsData[];
  notifications: NotificationsData[];
}

interface FriendsData {
  id: string;
  profilePic: string;
  nickname: string;
  status: any;
}

interface AchievementsData {
  id: string;
  title: string;
  description: string;
  userScore: number;
  totalScore: number;
}

interface NotificationsData {
  userId: string;
  userProfilePic: string;
  description: string;
  typeOfRequest: any;
  responded: boolean;
}


function Dashboard() {

  const [dashboardData, setDashboardData] = useState<dashboardData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/Dashboard', { withCredentials: true});
        // const data = await response.json();
        console.log("data", response.data);
        setDashboardData(response.data);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log("hello", dashboardData);
  const doneAchievements = dashboardData?.doneAchievements || [];
  const notDoneAchievements = dashboardData?.notDoneAchievements || [];
  const friends = dashboardData?.friends || [];
  const notifications = dashboardData?.notifications || [];

  const [theme, setTheme] = useState('yo1.jpg');
  const [powerup, setPowerup] = useState('FireBall');

  const handleThemeChange = (newtheme: string) => {
    setTheme(newtheme);
  }
  const handlePowerUpChange = (newpowerup: string) => {
    setPowerup(newpowerup);
  }

  return (
    <main className="flex flex-col md:overflow-hidden font-white">
      <TopBar />
      <div className="flex flex-col lg:mt-10 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 grid-rows-5 lg:grid-rows-3 gap-4 w-full h-full mt-4">
          
          <div className="relative p-20 rounded-md col-span-1 lg:col-span-3 h-[300px] lg:w-full shadow-md" style={{backgroundImage: `url(${theme})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <PlayButton theme = {theme} PowerUp={powerup}/>
          </div>

          <Achievements 
          doneAchievements={doneAchievements}
          notDoneAchievements={notDoneAchievements} />

          <Themes handleThemeChange={handleThemeChange} />

          <div className="bg-white p-4 rounded-md col-span-1 lg:col-span-2 lg:col-start-4 lg:col-end-6  
          row-start-4 row-end-5 lg:row-start-2 lg:row-end-4
          lg:w-full shadow-md">
              friend list
          </div>

          <PowerUps handlePowerUpChange={handlePowerUpChange}/>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;