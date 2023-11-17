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
import React, { useState } from 'react';
import PowerUps from '../ui/PowerUps';
import PlayButton from '../ui/PlayButton';

export default function Dashboard() {
  
  const [theme, setThem] = useState('yo1.jpg');
  const [powerup, setPowerup] = useState('FireBall');

  const handleThemeChange = (newtheme: string) => {
    setThem(newtheme);
  }
  const handlePowerUpChange = (newpowerup: string) => {
    setPowerup(newpowerup);
  }

  return (
    <main className="flex flex-col md:overflow-hidden">
      <TopBar />
      <div className="flex flex-col lg:mt-10 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 grid-rows-5 lg:grid-rows-3 gap-4 w-full h-full mt-4">
          
          <div className="relative p-20 rounded-md col-span-1 lg:col-span-3 h-[300px] lg:w-full shadow-md" style={{backgroundImage: `url(${theme})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <PlayButton theme = {theme} PowerUp={powerup}/>
          </div>

          <Achievements />

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
