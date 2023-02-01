import { useNavigation } from "@react-navigation/native";
import { Card } from "@rneui/themed";
import { signOut } from "firebase/auth";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { ProfileAdditional, ProfileImage, ProfileSkeleton, ThemeCard } from "../components";

import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import { ProfileScreenNavigatorProp } from "../typings";
import { returnHexCode } from "../utils/returnHexCodes";

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
          <View>
            {/* Name + Female */}
            <View style={tw("flex flex-row items-center justify-between flex-wrap mb-4")}>
              <View>
                <View>
                  <Text style={tw("text-lg text-gray-800")}>{user.name}</Text>
                </View>
                <View>
                  <Text style={tw("text-lg text-gray-800")}>{user.female}</Text>
                </View>
              </View>
              {/* Group or Disciplines */}
              <ProfileAdditional />

              {/* <View>
                {user.type === "student" ? (
                  <View>
                    <Text style={tw("mb-2 text-gray-800")}>Ваша группа</Text>
                    <Text style={tw("text-xl font-bold")}>{user.groupId}</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={tw("mb-2 text-gray-800")}>Вы вёдете</Text>
                    <Text style={tw("text-[18px] font-bold")}>
                      <Text
                        style={{ color: returnHexCode(user.theme) }}
                        onPress={() => navigation.navigate("Discipline")}
                      >
                        ({user.disciplines.length}){" "}
                      </Text>
                      предмета
                    </Text>
                  </View>
                )}
              </View> */}
            </View>

            <Card.Divider />
            {/* User theme */}

            <View style={tw("mb-4")}>
              <View style={tw("flex flex-row justify-center -mr-4")}>
                <ThemeCard isBordered theme="blue" />
                <ThemeCard isBordered theme="emerald" />
                <ThemeCard isBordered theme="rose" />
                <ThemeCard isBordered theme="violet" />
              </View>
            </View>

            <Card.Divider />

            {/* User type */}
            <View style={tw("mb-4")}>
              <Text>Уровень доступа </Text>
              <Text style={tw("text-lg font-bold mt-1")}>
                {user.type === "student" ? "Студент" : "Преподаватель"}
              </Text>
            </View>

            <Card.Divider />

            {/* Feedback */}
            <TouchableOpacity
              onPress={() => {
                console.log("hey");
              }}
            >
              <Text style={[tw("text-center"), { color: returnHexCode(user?.theme || "blue") }]}>
                Оставить отзыв
              </Text>
            </TouchableOpacity>
          </View>
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
            { color: returnHexCode(user?.theme || "blue") },
          ]}
        >
          Выйти из аккаунта
        </Text>
      </TouchableOpacity>
    </View>
  );
};
