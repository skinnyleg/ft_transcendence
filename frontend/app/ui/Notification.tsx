
import { NotificationsData } from "../Dashboard/page"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface NotificationsProps  {
    handleNotification: (NotificationsData: NotificationsData) => void;
}

const Notifications = ({ handleNotification } : NotificationsProps) => {
    const [notifications, setNotifications] = useState<NotificationsData[]>([]);
    const socket = io("http://localhost:8000");

    useEffect(() => {
        socket.on("notification", (data: NotificationsData) => {
            setNotifications((prevNotifications) => {
                return [...prevNotifications, data];
            });
            handleNotification(data);
        });
    }, []);

    return (
        <div className="notifications">
            <h3>Notifications</h3>
            <ul>
                {notifications.map((notification) => {
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