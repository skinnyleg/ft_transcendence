import { BellAlertIcon } from "@heroicons/react/24/outline";
import { NotificationsData } from "@/app/interfaces/interfaces"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import clsx from "clsx";
import { Cookies } from "react-cookie";
// interface NotificationsProps  {
//     handleNotification: (NotificationsData: NotificationsData) => void;
// }


const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationsData[]>([]);
    const [notifSent, setNotifSent] = useState< | null>(null)
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationNumber, setNotificationNumber] = useState(0);
    const [newNotification, setNewNotification] = useState<NotificationsData | null>(null);
    const [notifPopUP, setNotifPopUp] = useState <NotificationsData | null>(null);
    const cookies = new Cookies();
    const token = cookies.get('token');
    const socket = io("http://localhost:8000/friendsGateway", {
        withCredentials: true,
        transportOptions: {
          polling: {
            extraHeaders: {
              "token": token
            }
          }
        }
      });
    socket.connect;
      socket.on("connect", () => {
        console.log(socket.connected);
    });
    

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
            }
        }catch(error){
            console.error(error);
        }
        }
    }, [newNotification]);

    const knotifications = [{
        userId: "1",
        description: "You have a new friend request from user 2",
    },
    {
        userId: "2",
        description: "You have a new friend request from user 3",
    },];

    const handleNewNotification = (data: NotificationsData) => {
        setNewNotification(data);
        setNotificationNumber(notificationNumber + 1);
        
    }

    // useEffect(() => {

    //     socket.on("notification", (notif) => {
    //         console.log(notif);
    //         setNotifSent(notif);
    //     });

    //     socket.on("notifHistory", (data: NotificationsData) => {
    //         console.log(socket.connected);
    //         setNotifications((prevNotifications) => {
    //             return [...prevNotifications, data];
    //         });
    //         handleNewNotification(data);
    //     });
    // }, []);

    return (
        <div className="notifications relative">
            <BellAlertIcon onClick={()=>{setShowNotifications(!showNotifications)}} className= "h-[55px] hidden lg:flex w-[55px] p-2 bg-gray-100 text-accents rounded-full"/>
            <span className={clsx(`absolute text-s text-white font-bold rounded-full h-5 w-5 flex items-center md:hidden hidden xl:flex lg:flex justify-center bottom-0 right-0 transform translate-x-[8px]`
            , {'hidden' : showNotifications},
            {
                'bg-red-500 ' : (notificationNumber > 0),
                'bg-gray-500' : (notificationNumber === 0),})}>{notificationNumber}
            </span>
            <ul className={`absolute bg-white rounded-md shadow-md p-2 top-10 right-0 w-60 h-60 overflow-y-scroll styled-scrollbar ${showNotifications ? '' : 'hidden'}`}>
                {showNotifications && knotifications.map((notification) => {
                    return (
                        <li key={notification.userId}>
                            <p>{notification.description}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Notifications;