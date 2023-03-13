import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
// eslint-disable-next-line import/no-extraneous-dependencies
import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { ProfileBio, ProfileImage, ProfileSkeleton, ProfileTheme } from "../components";
import { ProfileMainTheme } from "../components/profile/ProfileMainTheme";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import { UType } from "../typings/enums";
import { returnAppTheme, returnDarkenHexCode, returnHexCode } from "../utils";

const userTypeToStringMap: Record<UType, string> = {
   student: "Студент",
   teacher: "Преподаватель",
   admin: "Админ",
};

export function ProfileScreen() {
   const tw = useTailwind();

   const user = useSelector(selectUser);

   const handleFeedbackModal = () => {
      // open feedback modal
   };

   if (user === null) {
      return <ProfileSkeleton />;
   }

   return (
      <View
         style={[
            tw("flex flex-col h-full relative"),
            {
               backgroundColor: returnAppTheme(user.appTheme),
            },
         ]}
      >
         {/* Feedback icon + Avatar */}

         <LinearGradient
            colors={[returnHexCode(user.theme), returnDarkenHexCode(user.theme)]}
            style={tw("w-full pt-12 px-4 rounded-b-3xl flex items-center mb-12")}
            end={{
               x: 1,
               y: 0.5,
            }}
         >
            <View style={tw("flex flex-row justify-between items-center w-full")}>
               <Text style={tw("text-white font-semibold text-lg")}>Профиль</Text>
               {/* feedback  */}
               <TouchableOpacity>
                  <Icon name="info" color="white" size={30} />
               </TouchableOpacity>
            </View>
            <ProfileImage id={user.id} userImg={user.img} userName={user.name} />
         </LinearGradient>
         {/* </View> */}
         {/* Name + Second name + Role */}
         <View style={tw("flex flex-col w-full justify-center items-center")}>
            <Text
               style={[
                  tw("font-bold text-xl"),
                  {
                     color: returnHexCode(user.theme),
                  },
               ]}
            >
               {user.name} {user.female}
            </Text>
            <Text style={tw("text-gray-400 font-semibold text-lg")}>{userTypeToStringMap[user.type]}</Text>
         </View>
         <View style={tw("px-4 my-4")}>
            <LinearGradient
               colors={[returnHexCode(user.theme), returnDarkenHexCode(user.theme)]}
               style={tw("w-full py-4 px-4 flex items-center rounded-md")}
               end={{
                  x: 1,
                  y: 0.5,
               }}
            >
               <ProfileBio name={user.name} female={user.female} theme={user.theme} />
               <ProfileMainTheme />
            </LinearGradient>
         </View>
         <View>
            <Text
               style={[
                  tw("text-center font-semibold text-lg mb-2"),
                  {
                     color: returnHexCode(user.theme),
                  },
               ]}
            >
               Тема элементов
            </Text>
            <ProfileTheme />
         </View>

         <TouchableOpacity
            style={tw("flex flex-row justify-center absolute bottom-10 w-full")}
            onPress={() => {
               signOut(auth);
            }}
         >
            <Text
               style={[tw("px-2 py-1 rounded-md text-lg underline"), { color: returnHexCode(user.theme) }]}
            >
               Выйти из аккаунта
            </Text>
         </TouchableOpacity>
      </View>
   );
}
