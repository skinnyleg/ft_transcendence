'use client';
import TopBar from "@/app/ui/top";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profileData } from "@/app/interfaces/interfaces";
import { ArrowTrendingUpIcon, TrophyIcon } from "@heroicons/react/20/solid";
import { ArrowTrendingDownIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Progress } from "@nextui-org/react";
import withAuth from "@/app/withAuth";

const matchHistory = [{
    id : "25/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"url",
    },
    loser : {
        nickname : "player2",
        profilePic : "url",
    },
    winnerScore : 2,
    loserScore : 1,
},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"url",
    },
    loser : {
        nickname : "player2",
        profilePic : "url",
    },
    winnerScore : 2,
    loserScore : 1,
},]

const profile = () => {

    const [isFriend, setIsFriend] = useState<boolean | undefined>(false);
    const [isprivateProfile, setisprivateProfile] = useState<boolean | undefined>(false);
    const pathname = usePathname();
    const [profileData, setProfileData] = useState<profileData | undefined>(undefined);
    let nickname : string = pathname.split("/")[2];
    console.log(nickname);

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/user/profile/${nickname}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (res.ok) {
                    const profileData = await res.json();
                    console.log(profileData);
                    setProfileData(profileData);
                }
            } catch (error) {
                console.error("Error during authentication check:", error);
            }
        };
        getProfileData();
        setIsFriend(profileData?.isfriend);
        setisprivateProfile(profileData?.privateProfile);
    }, []);


    return (
    <main className="flex flex-col font-white">
        <TopBar nickname={nickname}/>
        <div className="flex flex-col mt-2">
            <div className="grid grid-cols-4 auto-rows-min gap-2 w-full h-[88vh] mt-4 md:grid-row-4 grid-row-4">
                <div className="bg-white relative col-span-4 h-[250px] row-start-1 row-end-2 w-full shadow-md rounded-xl">
                    <div className="flex flex-col rounded-xl h-[250px]" style={{backgroundImage: `url(${profileData?.userData.BackgroundPic})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                        <h1 className="p-5 text-3xl text-white text-bold-900">{profileData?.userData.nickname}</h1>
                    </div>
                    <div  className="rounded-full w-[80px] h-22 absolute bottom-0 left-0 transform  translate-x-[8px] translate-y-[32px] border-2">
                        <img src={profileData?.userData.profilePic} alt="profile Picture" className="rounded-full w-20 h-20 rounded-full" />
                    </div>
                </div>

                <div className="bg-lightblue col-start-2 col-end-4 row-start-2 h-[20px] rounded-xl w-[750px] row-end-3 flex shadow-md">
                    <div className="w-full h-full bg-white rounded-xl">
                        <div
                        className={`w-[${(profileData?.userData.level) * 10}%] h-full rounded-xl bg-lightblue`}
                        >
                        </div>
                    </div>
                </div>
                <div className=" relative col-start-4 col-end-5 row-start-2 h-[20px] row-end-3 flex w-full  shadow-md rounded-xl">
                    <button className="bg-green-500 hover:bg-green-700 text-white  py-1/2 px-5 text-sm ml-20 rounded-full" onClick={() => {}}>Add Friend</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white  py-1/2 px-5 text-sm rounded-full ml-6" onClick={() => {}}>chat</button>    
                </div>
                {/* 4 cards */}
                <div  className="bg-lightblue col-span-1 row-start-3 flex justify-between row-end-4 w-full h-[100px] shadow-md rounded-xl">
                    <div className="flex">
                        <WalletIcon className="text-[#FDF7E4] w-15 h-15 mx-auto mt-2"/>
                        <p className="text-2xl text-center w-20 mt-6 text-bold-700">Wallet</p>
                    </div>
                    <h2 className="text-2xl text-center mt-8 text-bold-700 mr-10">{profileData?.userData.wallet}</h2>
                </div>
                <div  className="bg-lightblue col-span-1 flex justify-between mx-auto row-start-3 row-end-4 w-full h-[100px] shadow-md rounded-xl">
                    <div className="flex">
                        <TrophyIcon className="text-[#FDF7E4] w-15 h-15 mx-auto mt-2"/>
                        <p className="text-2xl text-center w-20 mt-6 text-bold-700">Rank</p>
                    </div>
                    <h2 className="text-5xl text-center mt-8 text-bold-700 mr-10">5</h2>
                </div>
                <div  className="bg-lightblue col-span-1 row-start-3 row-end-4 w-full h-[100px] shadow-md flex justify-between rounded-xl">
                    <ArrowTrendingUpIcon width={150} height={100} className="text-green-500"/>
                    <span className="center text-green-500 text-bold mt-5 mr-20 text-5xl" >2</span>
                </div>
                <div  className="bg-lightblue col-span-1 row-start-3 row-end-4 w-full h-[100px] shadow-md flex justify-between rounded-xl">
                    <ArrowTrendingDownIcon width={150} height={100} className="text-red-500"/>
                    <span className="center text-red-500 mt-5 mr-20 text-5xl" >2</span>
                </div>
                <div className="bg-lightblue col-span-2 row-start-4 row-end-5 w-full h-[280px] shadow-md rounded-xl">
                    <div className="w-[600px] overflow-y-scroll styled-scrollbar mt-5 mx-auto">
                        {matchHistory.map((match) => {
                            return (
                            <div className="flex flex-col  border border-[#69B02d] rounded-xl w-full mt-2">
                                <div className="flex flex-row justify-between">
                                    <div className="flex flex-row m-3">
                                        <img src="/yo.jpg" alt="profilePic" className="rounded-full w-10 h-10 rounded-full" />
                                        <h2 className="text-bold m-1 ml-5 text-lg">{match.winner.nickname}</h2>
                                    </div>
                                    <div className="flex flex-row justify-between border border-white rounded-xl w-20 h-[30px] mt-5 bg-signin text-white">
                                        <h2 className="text-bold ml-2 text-xl">{match.winnerScore}</h2>
                                        <h2 className="text-bold text-xl">:</h2>
                                        <h2 className="text-bold mr-2 text-xl">{match.loserScore}</h2>
                                    </div>
                                    <div className="flex flex-row-reverse m-3">
                                        <img src="/yo1.jpg" alt="profilePic" className="rounded-full w-10 h-10 rounded-full" />
                                        <h2 className="text-bold m-2 mr-5 text-lg" >{match.loser.nickname}</h2>
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>
                <div className="bg-lightblue col-span-2  row-start-4 row-end-5 w-full h-[280px] shadow-md rounded-xl"> match history </div>
            </div>
        </div>
    </main>
    );

}

export default withAuth(profile);