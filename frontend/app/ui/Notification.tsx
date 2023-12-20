import { BellAlertIcon } from "@heroicons/react/24/outline";
import { NotificationsData } from "@/app/interfaces/interfaces"
import { useContext, useEffect, useState } from 'react';
import clsx from "clsx";
import { socketContext } from "../context/soketContext";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationsData[]>([]);
    const [notifSent, setNotifSent] = useState< | null>(null)
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationNumber, setNotificationNumber] = useState(0);
    const [newNotification, setNewNotification] = useState<NotificationsData | null>(null);
    const [notifPopUP, setNotifPopUp] = useState <NotificationsData | null>(null);
    const socket = useContext(socketContext);
    const [userId, setUserId] = useState<string>('');
    const [ReqId ,setReqId] = useState<string>('');

    useEffect( () => {
        const notif = async() => {
        try{
            const res = await fetch(`http://localhost:8000/user/Notifications`, {
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
    }, [newNotification]);


    const handleNewNotification = (data: NotificationsData) => {
        setNewNotification(data);
        setNotificationNumber(notificationNumber);
    }
    useEffect(() => {
        socket.on("notification", (notif) => {
            console.log("ni=otif sent" ,notif);
            // setNotifSent(notif);
            toast.success(notif, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        });

        socket.on("error", (error) => {
            console.log("error sent" ,error);
            toast.error(error.message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        });

        socket.on("notifHistory", (data: NotificationsData) => {
            console.log("there", data);
            console.log(socket.connected, data);
            setNotifications((prevNotifications) => {
                return [...prevNotifications, data];
            });
            handleNewNotification(data);
        });
    }, [socket]);

    const handleAcceptReq = (data: NotificationsData) => {
        let useId = data.notifData.userId;
        let reqId = data.requestId;

        socket.emit("accept-request", {userId : useId , requestId : reqId});
        var i = notifications.indexOf(data);
        notifications.splice(i, 1);
        setNotifications(notifications);
        setNotificationNumber(notificationNumber - 1);
    }
    const handleRefuseReq = (data: NotificationsData) => {
        let useId = data.notifData.userId;
        let reqId = data.requestId;
        socket.emit("refuse-request", {userId : useId , requestId : reqId});
        var i = notifications.indexOf(data);
        notifications.splice(i, 1);
        setNotifications(notifications);
        setNotificationNumber(notificationNumber - 1);
    }

    return (
        <>
            <ToastContainer />
            <socketContext.Provider value={socket}>
            <div className="z-10 relative">
                <BellAlertIcon onClick={()=>{setShowNotifications(!showNotifications)}} className= "lg:h-[60px] lg:w-[60px] xl:h-[60px] xl:w-[60px] h-[35px] w-[35px] lg:flex lg:p-2 lg:bg-gray-100 text-accents rounded-full"/>
                <span className={clsx(`absolute text-sm text-white font-bold rounded-full h-5 w-5 items-center text-center flex justify-center bottom-0 right-0 transform translate-x-[8px]`
                , {'hidden' : showNotifications},
                {'bg-red-500 ' : (notificationNumber > 0),
                'bg-gray-500' : (notificationNumber === 0),})}>{notificationNumber}
                </span>
                <div className={`${showNotifications ? 'block' : 'hidden'} absolute lg:top-12 xl:top-12 top-8 right-3 lg:w-80 w-80 mx-auto bg-white shadow-md transition-transform duration-300 z-10 rounded-b-lg`}>
                    <div className="flex flex-col">
                    {showNotifications && notifications.map((notification) => (
                        <div key={notification.requestId} className="flex justify-between items-center p-2 hover:bg-gray-100 z-10">
                            <img src={notification.notifData.userProfilePic} alt="profile" className="w-1/7 h-10 rounded-full" />
                            <p className="ml-1 w-1/2 text-black text-sm">{notification.notifData.description}</p>
                            <div className="flex w-1/4 h-10 justify-between rounded-full bg-slate-100">
                                <CheckIcon className={`${notification.notifData.typeOfRequest === 'FRIEND' ? 'block' : 'hidden'}w-full h-10 text-green-600 cursor-pointer `} onClick={() => {handleAcceptReq(notification)}}/>
                                <XMarkIcon className={`${notification.notifData.typeOfRequest === 'FRIEND' ? 'block' : 'hidden'}w-full h-10 text-red-600 cursor-pointer `} onClick={() => {handleRefuseReq(notification)}}/>
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