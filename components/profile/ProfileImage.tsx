import React from "react";

import { TouchableOpacity, View } from "react-native";

import { useProfileImage } from "../../hooks";
import { UserProfileAvatar } from "../common";

interface Props {
   id: string;
   userImg: string;
   userName: string;
}

export const ProfileImage: React.FC<Props> = React.memo(({ id, userImg, userName }) => {
   const { pickImage, profileImage } = useProfileImage(id);

   return (
      <View>
         <TouchableOpacity onPress={pickImage}>
            {userImg !== "" || profileImage ? (
               // выводим фото пользователя
               // при обновлении фото пушим ее в стейт
               <UserProfileAvatar source={profileImage || userImg} />
            ) : (
               // рендрим просто первую букву имени
               <UserProfileAvatar title={userName[0]} />
            )}
         </TouchableOpacity>
      </View>
   );
});
