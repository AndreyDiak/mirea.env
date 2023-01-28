import { useNavigation } from "@react-navigation/native";
import { Card, Skeleton } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { ThemeCard, UserAvatar } from "../components";

import { getUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import { returnHexCode } from "../utils/returnHexCodes";

export const ProfileScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation<ProfileScreenNavigatorProp>();
  const user = useSelector(getUser) as Student | Teacher;
  const [profileImage, setProfileImage] = useState<null | string>(null);

  const pickImage = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    }).then(async (image) => {
      if (!image.cancelled) {
        // @ts-ignore
        setProfileImage(image.uri);
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.onerror = (e) => {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          // @ts-ignore
          xhr.open("GET", image.uri, true);
          xhr.send(null);
        });

        const imageRef = ref(storage, `users/${user.userId}/image`);
        // @ts-ignore
        await uploadBytes(imageRef, blob)
          .then(async (snapshot) => {
            const downloadUrl = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "users", user.userId), {
              img: downloadUrl,
            }).then(() => console.log("photo updated!"));
          })
          .catch((err) => {
            // setIsLoading(false);
          });
        // @ts-ignore
        blob.close();
      }
    });
  };

  if (user === null) {
    return (
      <View style={tw("h-full w-full mt-10 px-4 flex flex-col justify-center")}>
        <View style={tw("flex flex-row justify-between mb-10")}>
          <Skeleton circle style={tw("w-20 h-20")} />
          <Skeleton style={tw("w-4/6 h-20 rounded-md")} />
        </View>
        <View style={tw("mb-10")}>
          <Skeleton style={tw("w-full h-40 rounded-lg")} />
        </View>
        <View>
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <View key={index} style={tw("flex flex-row justify-between mb-5")}>
                <Skeleton style={tw("w-5/6 h-10 rounded-md")} />
                <Skeleton circle style={tw("w-10 h-10")} />
              </View>
            ))}
        </View>
      </View>
    );
  }

  return (
    <View style={tw("flex flex-col h-full relative")}>
      {/* Avatar + email */}
      <View style={tw("px-8 pt-12 pb-4 bg-slate-200")}>
        <View style={tw("flex flex-row items-center justify-between")}>
          {/* TODO включить обратно */}
          <View>
            {user.img !== "" || profileImage ? (
              <UserAvatar source={profileImage || user.img} />
            ) : (
              <UserAvatar title={user.name[0]} />
            )}
          </View>
          <View>
            <Text
              style={[
                tw("text-gray-800 text-xl font-semibold"),
                {
                  fontFamily: "Roboto_400Regular",
                },
              ]}
            >
              {user.email}
            </Text>
          </View>
        </View>
        <Text style={tw("underline")} onPress={pickImage}>
          Загрузить
        </Text>
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
              <View>
                {user.type === "student" ? (
                  <View>
                    <Text style={tw("mb-2 text-gray-800")}>Ваша группа</Text>
                    <Text style={tw("text-xl font-bold")}>{user.group}</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={tw("mb-2 text-gray-800")}>Вы вёдете</Text>
                    <Text style={tw("text-[18px] font-bold")}>
                      <Text
                        style={{ color: returnHexCode(user.theme as AppTheme) }}
                        onPress={() => navigation.navigate("Discipline")}
                      >
                        ({user.disciplines.length}){" "}
                      </Text>
                      предмета
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Card.Divider />
            {/* User theme */}
            <View style={tw("mb-2")}>
              {/* <View
                style={tw("pb-4 flex flex-row items-center justify-between")}
              >
                <Text>Ваша тема</Text>
                <View>
                  <ThemeCard isBordered={false} theme={user.theme} />
                </View>
              </View> */}

              {/* <Card.Divider /> */}
              <View style={tw("mb-4")}>
                <Text style={tw("text-center mb-2")}>Тема</Text>
                {/* TODO включить обратно */}
                <View style={tw("flex flex-row justify-center -mr-4")}>
                  <ThemeCard isBordered theme="blue" />
                  <ThemeCard isBordered theme="emerald" />
                  <ThemeCard isBordered theme="rose" />
                  <ThemeCard isBordered theme="violet" />
                </View>
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
                // Открывает диалоговое окно, где можно написать отзыв...
                console.log("hey");
              }}
            >
              <Text style={[tw("text-center"), { color: returnHexCode(user.theme as AppTheme) }]}>
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
          console.log("logout");
          signOut(auth);
        }}
      >
        <Text
          style={[
            tw("px-2 py-1 rounded-md text-lg underline"),
            { color: returnHexCode(user.theme as AppTheme) },
          ]}
        >
          Выйти из аккаунта
        </Text>
      </TouchableOpacity>
    </View>
  );
};
