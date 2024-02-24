'use client'
import Image from "next/image";
import speedMeter from "/public/speedMeter.svg";
import ZoomIn from "/public/ZoomIn.svg";
import Shrink from "/public/Shrink.svg";
import ExtraTime from "/public/ExtraTime.svg";
import { useState } from "react";

const GamePowerUps = ({powerUpSetter}: any) => {

    const   [power, setPower] = useState('');

    const handlePower = (powerUp: string) => {
        if (power === powerUp) {
            setPower('');
            powerUpSetter('');
        }
        else {
            setPower(powerUp);
            powerUpSetter(powerUp);
        }
    }

    return (
        <div className="bg-transparent rounded-md lg:col-span-3 col-span-1 lg:w-full md:h-[260px] h-[250px] xl:h-[94%] lg:h-[94%] row-start-3 row-end-4">
            <div className=" w-full h-[35%] flex items-end ">
                <h1 className="text-2xl">POWER UPS</h1>
            </div>
            <div className="bg-cyan-600 w-full h-[65%] rounded-[15px] flex flex-nowrap justify-between items-center p-2">
                <div 
                onClick={() => {handlePower('speedMeter')}}
                className={` hover:cursor-pointer w-[22.5%] h-[90%] rounded-[15px] ${power === 'speedMeter' ? "bg-teal-300" : 'bg-cyan-100'}`}>
                    <Image 
                        className="w-full h-full"
                        src={speedMeter}
                        alt="speed run"
                    />
                </div>
                <div onClick={() => {handlePower('ZoomIn')}}
                className={`hover:cursor-pointer w-[22.5%] h-[90%] rounded-[15px] ${power === 'ZoomIn' ? "bg-teal-300" : 'bg-cyan-100'}`}>
                    <Image 
                        className="w-full h-full"
                        src={ZoomIn}
                        alt="grow paddle"
                    />
                </div>
                <div onClick={() => {handlePower('Shrink')}}
                className={`hover:cursor-pointer w-[22.5%] h-[90%] rounded-[15px] ${power === 'Shrink' ? "bg-teal-300" : 'bg-cyan-100'}`}>
                    <Image 
                        className="w-full h-full"
                        src={Shrink}
                        alt="shrink paddle"
                    />
                </div>
                <div onClick={() => {handlePower('ExtraTime')}}
                className={`hover:cursor-pointer w-[22.5%] h-[90%] rounded-[15px] ${power === 'ExtraTime' ? "bg-teal-300" : 'bg-cyan-100'}`}>
                    <Image
                        className="w-full h-full"
                        src={ExtraTime}
                        alt="extra goal"
                    />
                </div>
            </div>
        </div>
    );
};

export default GamePowerUps;