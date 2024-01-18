import { BellAlertIcon } from "@heroicons/react/24/outline";
import { NotificationsData } from "@/app/interfaces/interfaces"
import { useContext, useEffect, useState } from 'react';
import clsx from "clsx";
import { ChatContext, chatSocketContext, socketContext } from "../context/soketContext";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { MatchInfo } from "../game/types/interfaces";
import { gameSocketContext } from "../context/gameSockets";



const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationsData[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationNumber, setNotificationNumber] = useState(0);
    const [notif , setNotif] = useState<string>('');
    const [Error , setError] = useState<string>('');
    const socket = useContext(socketContext);
    const chatSocket = useContext(chatSocketContext);
    const gameSocket = useContext(gameSocketContext);
    const {channelId, personalId} = useContext(ChatContext);
    const router = useRouter();

    useEffect(() => {
        const notif = async() => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/Notifications`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            if (res.status === 200) {
                const notification = await res.json();
                setNotifications(notification);
                setNotificationNumber(notificationNumber + notification.length);
            }
        }catch(error){
            console.error(error);
        }
        }
        notif();
    }, []);

    const handleNewNotification = (data: NotificationsData) => {
        setNotificationNumber(notificationNumber + 1);
    }

    const check_notif = (notif: string) => {
        if (notif === 'Forbidden action')
            return true;
        if (notif === 'Invalide data')
            return true;
        if (notif === 'get user channels failed')
            return true;
        if (notif === 'get user DMs failed')
            return true;
        return false;
    }


    useEffect(() => {


        chatSocket.on("notification", (notif) => {
            console.log("ni=otif sent" ,notif);
            toast.success(notif, {
                toastId: 'chatNotifSucces',
                autoClose: 500
            });
        });


        chatSocket.on("failed", (notif) => {
            console.log('error notif == ', notif)
            if (check_notif(notif) === true)
                return ;
            toast.error(notif, {
                toastId: 'chatNotifError',
                autoClose: 500
            });
        });

        chatSocket.on("notifHistory", (data: NotificationsData) => {
            console.log("data chatSocket == ", data);
            setNotifications((prevNotifications) => {
                return [...prevNotifications, data];
            });
            handleNewNotification(data);
        });

        return () => {
            chatSocket.off('notification');
            chatSocket.off('notifHistory');
            chatSocket.off('failed');
        }
        //TODO now that added the dependency i need to test error notif again
    }, [chatSocket])


    useEffect(() => {
        gameSocket.on("notification", (notif) => {
            console.log("ni=otif sent" ,notif);
            toast.success(notif, {
                toastId: 'gameNotifSucces',
                autoClose: 500
            });
        });


        gameSocket.on("error", (notif) => {
            console.log('error notif == ', notif)
            if (check_notif(notif) === true)
                return ;
            toast.error(notif, {
                toastId: 'gameNotifError',
                autoClose: 500
            });
        });

        gameSocket.on('notifHistory', (data: NotificationsData) => {
            console.log("data gameSocket == ", data);
            setNotifications((prevNotifications) => {
                return [...prevNotifications, data];
            });
            handleNewNotification(data);
        });

        gameSocket.on('redirectPlayers_match', (data: MatchInfo[]) => {
            console.log('redirecting to game');
              router.push(`/game/${data[0].roomId}`);
        })
        if (gameSocket.connected)
            gameSocket.emit('abort');

        return () => {
            gameSocket.off('notification');
            gameSocket.off('notifHistory');
            gameSocket.off('error');
            gameSocket.off('redirectPlayers_match');
        }
        //TODO now that added the dependency i need to test error notif again
    }, [gameSocket])


    useEffect(() => {
        socket.on("notification", (notif) => {
            console.log("ni=otif sent" ,notif);
            toast.success(notif, {
                toastId: 'success',
                autoClose: 500
            });
        });

        socket.on("error", (error) => {
            console.log("error sent" ,error);
            toast.error(error.message, {
                toastId: 'error',
                autoClose: 500
            });
            setError(error.message);
        });

        socket.on("notifHistory", (data: NotificationsData) => {
            console.log("data socket == ", data);
            console.log(socket.connected, data);
            setNotifications((prevNotifications) => {
                return [...prevNotifications, data];
            });
            handleNewNotification(data);
        });


        return () => {
            socket.off('error').off()
            socket.off('notification').off()
            socket.off('notifHistory').off()
        }
    }, [socket]);

    const handleAcceptReq = (data: NotificationsData) => {
        let useId = data.notifData.userId;
        let reqId = data.requestId;
        if (data.notifData.typeOfRequest === 'JOINCHANNEL')
        {
            chatSocket.emit('responseJoin', {
                channelName: data.notifData.channelName,
                user: data.notifData.userId,
                value: true,
                requestId: data.requestId
            })
        }
        else if (data.notifData.typeOfRequest === 'CHALLENGE'){
            gameSocket.emit('acceptChallenge', {userId: data.notifData.userId, requestId: data.requestId});
        }
        else
        {
            console.log('here')
            socket.emit("accept-request", {userId : useId , requestId : reqId});
            socket.on('refreshPersonalTab', () => {
                chatSocket.emit('getUserDms');
            })
        }
        var i = notifications.indexOf(data);
        notifications.splice(i, 1);
        setNotifications(notifications);
        setNotificationNumber(notificationNumber - 1);
    }
    
    const handleRefuseReq = (data: NotificationsData) => {
        let useId = data.notifData.userId;
        let reqId = data.requestId;

        if (data.notifData.typeOfRequest === 'JOINCHANNEL')
        {
            chatSocket.emit('responseJoin', {
                channelName: data.notifData.channelName,
                user: data.notifData.userId,
                value: false,
                requestId: data.requestId
            })
        }
        else if (data.notifData.typeOfRequest === 'CHALLENGE'){
            gameSocket.emit('refuseChallenge', {userId: data.notifData.userId, requestId: data.requestId});
        }
        else
            socket.emit("refuse-request", {userId : useId , requestId : reqId});
        var i = notifications.indexOf(data);
        notifications.splice(i, 1);
        setNotifications(notifications);
        setNotificationNumber(notificationNumber - 1);
    }

    return (
        <>
            <socketContext.Provider value={socket}>
            <div className="z-30 relative">
                <BellAlertIcon onClick={()=>{setShowNotifications(!showNotifications)}} className= "lg:h-[50px] lg:w-[50px] xl:h-[50px] xl:w-[50px] h-[35px] w-[35px] lg:flex lg:p-2 lg:bg-gray-100 text-accents rounded-full"/>
                <span className={clsx(`absolute text-sm text-white font-bold rounded-full h-5 w-5 items-center text-center flex justify-center bottom-0 right-0 transform translate-x-[8px]`
                , {'hidden' : showNotifications},
                {'bg-red-500 ' : (notificationNumber > 0),
                'bg-gray-500' : (notificationNumber === 0),})}>{notificationNumber}
                </span>
                <div className={`${showNotifications ? 'block' : 'hidden'} absolute lg:top-12 xl:top-12 top-8 right-3 lg:w-80 w-60 mx-auto bg-white shadow-md transition-transform duration-300 z-10 rounded-b-lg`}>
                    <div className="flex flex-col">
                    {showNotifications && notifications.map((notification) => (
                        <div key={notification.requestId} className="flex justify-between items-center p-2 hover:bg-gray-100 z-10">
                            <img src={notification.notifData.userProfilePic} alt="profile" className="rounded-full max-w-[40px] max-h-[40px] min-w-[40px] min-h-[40px]" />
                            <p className="ml-1 w-1/2 text-black text-sm">{notification.notifData.description}</p>
                            <div className="flex w-1/4 h-10 justify-between rounded-full bg-slate-100">
                            {/* ${notification.notifData.typeOfRequest === 'FRIEND' ? 'block' : 'hidden'} */}
                                <CheckIcon className={`w-full h-10 text-green-600 cursor-pointer `} onClick={() => {handleAcceptReq(notification)}}/>
                                <XMarkIcon className={`w-full h-10 text-red-600 cursor-pointer `} onClick={() => {handleRefuseReq(notification)}}/>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            </socketContext.Provider>
        </>
    );
}

export default Notifications;