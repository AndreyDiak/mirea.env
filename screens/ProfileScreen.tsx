import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import {
   MODAL_TYPES,
   ProfileBio,
   ProfileDisciplinesModal,
   ProfileFeedbackModal,
   ProfileImage,
   ProfileMainTheme,
   ProfileSkeleton,
   ProfileTheme,
   useGlobalModalContext,
} from "../components";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import { useTheme } from "../hooks";
import { USER_TYPE } from "../typings/enums";

const userTypeToStringMap: Record<USER_TYPE, string> = {
   student: "Студент",
   teacher: "Преподаватель",
   admin: "Админ",
};

export function ProfileScreen() {
   const tw = useTailwind();

   const user = useSelector(selectUser);

   const { openModal } = useGlobalModalContext();

   const { APP_THEME_MAIN, THEME_MAIN, THEME_DARKEN } = useTheme();

   const openFeedbackModal = () => {
      openModal(MODAL_TYPES.SIMPLE_MODAL, {
         title: "Обратная связь",
         children: ProfileFeedbackModal,
      });
   };

   const openDisciplineDialog = () => {
      openModal(MODAL_TYPES.SIMPLE_MODAL, {
         title: "Ваши дисциплины",
         children: ProfileDisciplinesModal,
      });
   };

   if (user === null) {
      return <ProfileSkeleton />;
   }

   return (
      <View
         style={[
            tw("flex flex-col h-full relative"),
            {
               backgroundColor: APP_THEME_MAIN,
            },
         ]}
      >
         <LinearGradient
            colors={[THEME_MAIN, THEME_DARKEN]}
            style={tw("w-full pt-12 px-4 rounded-b-3xl flex items-center mb-12")}
            end={{
               x: 1,
               y: 0.5,
            }}
         >
            <View style={tw("flex flex-row justify-between items-center w-full")}>
               <Text style={tw("text-white font-semibold text-lg")}>Профиль</Text>
               {/* feedback  */}
               <TouchableOpacity onPress={openFeedbackModal}>
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
                     color: THEME_MAIN,
                  },
               ]}
            >
               {user.name} {user.female}
            </Text>
            <Text style={tw("text-gray-400 font-semibold text-lg")}>{userTypeToStringMap[user.type]}</Text>
         </View>
         <View style={tw("px-4 my-4")}>
            <LinearGradient
               colors={[THEME_MAIN, THEME_DARKEN]}
               style={tw("w-full py-4 px-4 flex items-center rounded-md")}
               end={{
                  x: 1,
                  y: 0.5,
               }}
            >
               <ProfileBio openModal={openDisciplineDialog} />
               <ProfileMainTheme />
            </LinearGradient>
         </View>
         <View>
            <Text
               style={[
                  tw("text-center font-semibold text-lg mb-2"),
                  {
                     color: THEME_MAIN,
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
            <Text style={[tw("px-2 py-1 rounded-md text-lg underline"), { color: THEME_MAIN }]}>
               Выйти из аккаунта
            </Text>
         </TouchableOpacity>
      </View>
   );
}
