import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export const useNotifications = (userId: string | null) => {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const getNotifications = async () => {
      if (userId) {
        const q = query(collection(db, "notifications"), where("userId", "==", userId), where('isChecked', '==', false));
        const querySnap = await getDocs(q);
        const notifications = querySnap.docs.map(notification => ({
          ...notification.data(),
          notificationId: notification.id
        }));
        setNotifications(notifications as Notification[]);
      }
    };
    getNotifications();
    
  }, []);

  return notifications;
};
