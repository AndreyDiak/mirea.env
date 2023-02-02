import { useNavigation } from "@react-navigation/native";
import { Card } from "@rneui/themed";
import { signOut } from "firebase/auth";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { ProfileBio, ProfileImage, ProfileSkeleton, ProfileTheme } from "../components";

import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import type { ProfileScreenNavigatorProp } from "../typings";
import { UType } from "../typings/enums";
import { returnHexCode } from "../utils";

export const ProfileScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation<ProfileScreenNavigatorProp>();
  const user = useSelector(selectUser);

  if (user === null) {
    return <ProfileSkeleton />;
  }

  return (
    <View style={tw("flex flex-col h-full relative")}>
      {/* Avatar + email */}
      <View style={tw("px-8 pt-12 pb-4 bg-slate-200")}>
        <View style={tw("flex flex-row items-center justify-between")}>
          {/* TODO включить обратно */}
          <ProfileImage userId={user.userId} userImg={user.img} userName={user.name} />
          <View>
            <Text style={[tw("text-gray-800 text-xl font-semibold")]}>{user.email}</Text>
          </View>
        </View>
      </View>
      {/* Name + Type */}
      <View style={tw("p-6")}>
        <Text style={tw("text-center text-lg")}>Личные данные</Text>

        <Card containerStyle={tw("rounded-sm")}>
          {/* Name + Female */}
          <ProfileBio name={user.name} female={user.female} theme={user.theme} />
          <Card.Divider />
          <ProfileTheme />
          {/* User type */}
          <View style={tw("mb-4")}>
            <Text>Уровень доступа </Text>
            <Text style={tw("text-lg font-bold mt-1")}>
              {user.type === UType.STUDENT ? "Студент" : "Преподаватель"}
            </Text>
          </View>

          <Card.Divider />

          {/* Feedback */}
          <TouchableOpacity
            onPress={() => {
              console.log("hey");
            }}
          >
            <Text style={[tw("text-center"), { color: returnHexCode(user.theme) }]}>
              Оставить отзыв
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
      {/* Sign out */}

      <TouchableOpacity
        style={tw("flex flex-row justify-center absolute bottom-10 w-full")}
        onPress={() => {
          signOut(auth);
        }}
      >
        <Text
          style={[
            tw("px-2 py-1 rounded-md text-lg underline"),
            { color: returnHexCode(user.theme) },
          ]}
        >
          Выйти из аккаунта
        </Text>
      </TouchableOpacity>
    </View>
  );
};
