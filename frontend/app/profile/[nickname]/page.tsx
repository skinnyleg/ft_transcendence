'use client';
import TopBar from "@/app/ui/top";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Achievements, profileData } from "@/app/interfaces/interfaces";
import { ArrowTrendingUpIcon,   HandThumbUpIcon, UserPlusIcon, HandRaisedIcon, HandThumbDownIcon } from "@heroicons/react/20/solid";
import { ArrowTrendingDownIcon,  ChatBubbleLeftEllipsisIcon, UserMinusIcon, WalletIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { FaUserFriends } from "react-icons/fa";
import ProgressBar from "@/app/ui/progressBar";
import Conditional from "@/app/ui/Conditional";
import { ContextFriendProvider } from "@/app/context/profileContext";

const matchHistory = [{
    id : "25/122024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : true,
},
{
    id : "6/2/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/12/2024",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,

},
{
    id : "26/22424",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : true,
},
,
{
    id : "26//2424",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : true,
},
{
    id : "224/2424",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : true,
},
{
    id : "46/32424",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : true,
},
{
    id : "29/120/2424",
    winner : {
        nickname:"player 1",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "player2",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : true,
},
{
    id : "24/185/2424",
    winner : {
        nickname:"med-doba",
        profilePic:"/yo.jpg",
    },
    loser : {
        nickname : "yimazoua",
        profilePic : "/yo.jpg",
    },
    winnerScore : 2,
    loserScore : 1,
    isMeWhoWon : false,
},]


const Profile = () => {

    /// cant fetch data at the first login 
    const [isFriend, setIsFriend] = useState<boolean | undefined>(false);
    const [isprivateProfile, setisprivateProfile] = useState<boolean | undefined>(false);
    const [profileData, setProfileData] = useState<profileData | undefined>(undefined);
    const [achievements, setAchievements] = useState<Achievements[]>([])
    const [notAchievements, setNotAchievements] = useState<Achievements[]>([])
    const pathname = usePathname();
    let nickname : string = pathname.split("/")[2];

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/profile/${nickname}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (res.ok) {
                    const profileData = await res.json();
                    // console.log(profileData);
                    console.log("profile data == ", profileData);
                    setProfileData(profileData);
                }
            } catch (error) {
                console.error("Error during authentication check:", error);
            }
        };
        const getAchievements = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Achievements`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (res.ok) {
                    const achievementsData = await res.json();
                    // console.log(profileData);
                    console.log("achievement == ", achievementsData);
                    setAchievements(achievementsData.doneAchievements);
                    setNotAchievements(achievementsData.notDoneAchievements);
                }
            } catch (error) {
                console.error("Error during authentication check:", error);
            }
        };
        getAchievements();
        getProfileData();
        setIsFriend(profileData?.isfriend);
        setisprivateProfile(profileData?.privateProfile);

    }, []);
    var level : number = profileData?.userData?.level;

    
    return (
    <main className="flex flex-col">
        <TopBar />
        <div className="grid grid-cols-4 xl:mt-15 mt-20 lg:mt-5 lg:auto-rows-min xl:gap-5 gap-3 w-full md:grid-row-6 grid-row-6 ">
            <div className="relative col-start-1 col-end-5 xl:h-[33vh] lg:h-[33vh] md:h-[200px] h-[200px]  row-start-1 row-end-2 w-full shadow-md rounded-xl">
                <div className="flex relative  flex-col text-4xl text-white text-bold-900 rounded-xl xl:h-[33vh] lg:h-[33vh] md:h-[200px] h-[200px]">
                    <img src={profileData?.userData.BackgroundPic} className="w-full rounded-md h-full object-cover" alt="background Image"></img>
                </div>
                <div  className="rounded-full lg:w-[100px] md:w-[90px] w-[80px] xl:h-[150px] xl:w-[150px] absolute bottom-0 left-0 transform  xl:translate-x-[10px] xl:translate-y-[55px] translate-x-[8px] translate-y-[32px] border-2 max-w-[90px] max-h-[90px] min-w-[90px] min-h-[90px]">
                    <img src={profileData?.userData.profilePic} alt="profile Picture" className="lg:w-[100px] md:w-[90px] w-[80px] xl:h-[150px] xl:w-[150px] rounded-full max-w-[90px] max-h-[90px] min-w-[90px] min-h-[90px]" />
                </div>
                <div className="absolute bottom-[-10] left-24">
                    <h2 className=" text-black text-2xl left-10 inline-block pl-3">{profileData?.userData.nickname}</h2>
                </div>
            </div>
            <div className="bg-lightblue lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:mt-0 mt-2 md:mt-4 lg:row-end-3 col-start-1 col-end-4 row-start-3 row-end-4
            h-[30px] xl:h-[40px] rounded-2xl lg:w-[100%] md:w-[100%] w-[90%] flex shadow-md">
                <ProgressBar level={level} />
            </div>
            <div className="relative col-start-4 col-end-5 mt-2 md:mt-4 bg-accents rounded-2xl lg:mt-0 lg:row-start-2 mx-auto h-[30px] xl:h-[40px] lg:row-end-3 row-start-3 row-end-4 flex w-[80%] lg:w-[70%] xl:w-[70%]">
                <Conditional isfriend={profileData?.isfriend} privateProfile = {profileData?.privateProfile} isBlocked = {profileData?.isBlocked} userId= {profileData?.userData?.id}/>
            </div>
            <div className="col-span-4 lg:row-start-3 lg:row-end-4 row-start-4 row-end-5 flex flex-col md:flex-row justify-evenly  gap-2 items-center  w-full xl:h-[12vh] lg:h-[12vh] md:h-[12vh] h-[500px] rounded-3xl">
                <div className="w-full md:w-1/4 h-[40%] md:h-[90%] bg-cyan-600 rounded-3xl flex flex-row justify-between items-center p-2 gap-2 ">
                    <div className="flex flex-row gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" fill="none">
                            <path d="M6.25 28.1249H15.625V65.625H6.25C4.52412 65.625 3.125 64.2259 3.125 62.5V31.2499C3.125 29.524 4.52412 28.1249 6.25 28.1249ZM22.7903 24.0846L42.7919 4.08315C43.3416 3.53331 44.2122 3.47147 44.8341 3.938L47.4984 5.93625C49.0131 7.07225 49.6956 9.0079 49.2284 10.8427L45.6244 24.9999H65.625C69.0769 24.9999 71.875 27.7981 71.875 31.2499V37.8259C71.875 38.6425 71.715 39.4509 71.4044 40.2056L61.7344 63.6897C61.2522 64.8606 60.1109 65.625 58.8447 65.625H25C23.2741 65.625 21.875 64.2259 21.875 62.5V26.2943C21.875 25.4655 22.2043 24.6707 22.7903 24.0846Z" fill="#D4F1F4"/>
                        </svg>
                        <div className="flex flex-col">
                            <h1 className="text-cyan-900 text-[20px] font-semibold w-[47px]">WINS</h1>
                            <p className="text-cyan-100 text-[16px] font-semibold">PING PONG ZONE</p>
                        </div>

                    </div>
                    <h1 className="text-cyan-900 text-[50px] font-semibold">00</h1>
                </div>
                <div className="w-full md:w-1/4 h-[40%] md:h-[90%] bg-cyan-600 rounded-3xl flex flex-row justify-between items-center p-2 gap-2 ">
                    <div className="flex flex-row gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="69" height="63" viewBox="0 0 69 63" fill="none">
                            <path d="M65.75 37.875H56.375V0.375H65.75C67.4759 0.375 68.875 1.77412 68.875 3.5V34.75C68.875 36.4759 67.4759 37.875 65.75 37.875ZM49.2097 41.9153L29.2081 61.9169C28.6584 62.4666 27.7879 62.5284 27.1659 62.0619L24.5016 60.0638C22.9869 58.9278 22.3043 56.9919 22.7714 55.1572L26.3755 41H6.375C2.92322 41 0.125 38.2019 0.125 34.75V28.1741C0.125 27.3575 0.284938 26.5491 0.59575 25.7944L10.2657 2.31016C10.7478 1.13922 11.889 0.375 13.1553 0.375H47C48.7259 0.375 50.125 1.77412 50.125 3.5V39.7056C50.125 40.5344 49.7956 41.3294 49.2097 41.9153Z" fill="#D4F1F4"/>
                        </svg>
                        <div className="flex flex-col">
                            <h1 className="text-cyan-900 text-[20px] font-semibold w-[47px]">LOSSES</h1>
                            <p className="text-cyan-100 text-[16px] font-semibold">PING PONG ZONE</p>
                        </div>

                    </div>
                    <h1 className="text-cyan-900 text-[50px] font-semibold">00</h1>
                </div>
                <div className="w-full md:w-1/4 h-[40%] md:h-[90%] bg-cyan-600 rounded-3xl flex flex-row justify-between items-center p-2 gap-2 ">
                    <div className="flex flex-row gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" fill="none">
                            <path d="M40.6403 52.9406V59.3841H56.2653V65.6341H18.7652V59.3841H34.3903V52.9406C22.058 51.4028 12.5152 40.8828 12.5152 28.1342V9.38416H62.5153V28.1342C62.5153 40.8828 52.9725 51.4028 40.6403 52.9406ZM3.14025 15.6342H9.39025V28.1342H3.14025V15.6342ZM65.6403 15.6342H71.8903V28.1342H65.6403V15.6342Z" fill="#D4F1F4"/>
                        </svg>
                        <div className="flex flex-col">
                            <h1 className="text-cyan-900 text-[20px] font-semibold w-[47px]">RANK</h1>
                            <p className="text-cyan-100 text-[16px] font-semibold">PING PONG ZONE</p>
                        </div>
                    </div>
                    <h1 className="text-cyan-900 text-[50px] font-semibold">00</h1>
                </div>
                <div className="w-full md:w-1/4 h-[40%] md:h-[90%] bg-cyan-600 rounded-3xl flex flex-row justify-between items-center p-2 gap-2 ">
                    <div className="flex flex-row gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" fill="none">
                            <path d="M68.7653 18.75H46.8903C36.535 18.75 28.1403 27.1447 28.1403 37.5C28.1403 47.8553 36.535 56.25 46.8903 56.25H68.7653V62.5C68.7653 64.2259 67.3663 65.625 65.6403 65.625H9.39026C7.66438 65.625 6.26526 64.2259 6.26526 62.5V12.5C6.26526 10.7741 7.66438 9.375 9.39026 9.375H65.6403C67.3663 9.375 68.7653 10.7741 68.7653 12.5V18.75ZM46.8903 25H71.8903V50H46.8903C39.9866 50 34.3903 44.4034 34.3903 37.5C34.3903 30.5964 39.9866 25 46.8903 25ZM46.8903 34.375V40.625H56.2653V34.375H46.8903Z" fill="#D4F1F4"/>
                        </svg>
                        <div className="flex flex-col">
                            <h1 className="text-cyan-900 text-[20px] font-semibold w-[47px]">WALLET</h1>
                            <p className="text-cyan-100 text-[16px] font-semibold">PING PONG ZONE</p>
                        </div>

                    </div>
                    <h1 className="text-cyan-900 text-[50px] font-semibold">00</h1>
                </div>
            </div>
            <div className="bg-cyan-600 lg:col-span-2 col-span-4 lg:row-start-4  lg:row-end-5 row-start-5 row-end-6 w-full xl:h-[37vh] lg:h-[38vh] h-[450px] shadow-md rounded-xl">
                 <h1 className="text-bold text-3xl text-center mt-2 text-cyan-900">MATCH HISTORY</h1>
                <div className=" h-[95%] pt-2 pb-2">
                    <div className="lg:w-[95.31%] xl:w-[90%] w-[98%] mt-5 h-[90%] mx-auto styled-scrollbar overflow-y-scroll">
                        {
                            matchHistory.map((match) => {
                                return (
                                    <div key={match?.id}
                                        className=" mb-2 w-full h-[18.75%] p-2 flex flex-row justify-between items-center rounded-[15px] border bg-cyan-100 border-lightQuartze">
                                        <div className=" flex flex-row items-center gap-5">
                                            <img src={match?.loser.profilePic}
                                                className="rounded-full max-w-[55px] max-h-[55px] min-w-[55px] min-h-[55px]"
                                            />
                                            <h2 className="text-teal-600">{match?.loser.nickname}</h2>
                                        </div>
                                        <div className="bg-cyan-600 w-[20.41%] h-[56%] rounded-[30px] flex flex-row justify-evenly items-center">
                                            <div className="flex flex-row ">
                                                <h2 className="text-cyan-100">{match?.loserScore}</h2>
                                                <h2 className="text-cyan-100">:</h2>
                                                <h2 className="text-cyan-100">{match?.winnerScore}</h2>
                                            </div>
                                            <span className="text-bold text-cyan-100">{match?.isMeWhoWon ? `won` : `lose`}</span>
                                        </div>
                                        <div className="flex flex-row items-center gap-5">
                                            <h2 className="text-teal-600">{match?.winner.nickname}</h2>
                                            <img src={match?.winner.profilePic}
                                                className="rounded-full max-w-[55px] max-h-[55px] min-w-[55px] min-h-[55px]"
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        }
                
                    </div>
                </div>
            </div>
            <div className=" bg-cyan-600 lg:col-span-2 col-span-4 lg:row-start-4 lg:row-end-5 row-start-6 row-end-7 w-full xl:h-[37vh] lg:h-[38vh] h-[450px] shadow-md rounded-xl"> 
                <h2 className="text-bold text-3xl text-center mt-2 text-cyan-900">ACHIEVEMENT</h2>
                <div className="  h-[95%] pt-2 ">
                    <div className="lg:w-[95.31%] xl:w-[90%] w-[98%]  mx-auto h-[90%] flex mt-5 flex-col gap-2 overflow-y-auto styled-scrollbar">
                      {
                        achievements.map((achievement) => {
                            return (
                                <div key={achievement.id} className="p-2 rounded-[15px] border bg-cyan-100 border-lightQuartze w-full h-[18.75%]">
                                    <h2 className="font-bold text-[15px] lg:text-[20px]">{achievement.title}</h2>
                                    <p className="text-xs text-gray-500 ml-2 lg:text-sm lg:block md:block hidden">{achievement.description}</p>
                                </div>
                            )
                        })
                      }
                      {
                        notAchievements.map((achievement) => {
                            return (
                                <div key={achievement.id} className="p-2 rounded-[15px] flex flex-col justify-between border bg-gray-400 border-gray-500 w-full h-[18.75%]">
                                    <h2 className="font-bold text-[15px] lg:text-[20px]">{achievement.title}</h2>
                                    <p className="text-xs text-gray-500 ml-2 lg:text-sm lg:block md:block">{achievement.description}</p>
                                </div>
                            )
                        })
                    }
                    {
                        notAchievements.map((achievement) => {
                            return (
                                <div key={achievement.id} className="bg-red-500 w-full h-[18.75%]">
                                    <h2>{achievement.title}</h2>
                                    <p>{achievement.description}</p>
                                </div>
                            )
                        })
                    }
                    {
                        notAchievements.map((achievement) => {
                            return (
                                <div key={achievement.id} className="bg-red-500 w-full h-[18.75%]">
                                    <h2>{achievement.title}</h2>
                                    <p>{achievement.description}</p>
                                </div>
                            )
                        })
                    }
                                        {
                        notAchievements.map((achievement) => {
                            return (
                                <div key={achievement.id} className="bg-red-500 w-full h-[18.75%]">
                                    <h2>{achievement.title}</h2>
                                    <p>{achievement.description}</p>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        </div>
    </main>
    );

}

export default  (Profile);