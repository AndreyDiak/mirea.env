import { Card, Input, Skeleton } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import UserAvatar from "../components/UserAvatar";
import { getUser, setUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import { useUserData } from "../hooks/useUserData";
type Props = {};

const ProfileScreen = (props: Props) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<null | string>(null);
  const [profileImageBase64, setProfilImageBase64] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState<string | undefined>(user?.name);
  const [newFemale, setNewFemale] = useState<string | undefined>(user?.female);
  const [error, setError] = useState<string>("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
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
              <View
                key={index}
                style={tw("flex flex-row justify-between mb-5")}
              >
                <Skeleton style={tw("w-5/6 h-10 rounded-md")} />
                <Skeleton circle style={tw("w-10 h-10")} />
              </View>
            ))}
        </View>
      </View>
    );
  }

  const saveNewData = async () => {
    if (newName && newFemale) {
      setIsLoading(true);
      await updateDoc(doc(db, "users", user.userId), {
        name: newName,
        female: newFemale,
      }).then(async (snap) => {
        if (profileImage) {
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
              resolve(xhr.response);
            };
            xhr.onerror = (e) => {
              console.log(e);
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", profileImage, true);
            xhr.send(null);
          });

          const imageRef = ref(storage, `users/${user.userId}/image`);
          // @ts-ignore
          await uploadBytes(imageRef, blob)
            .then(async (snapshot) => {
              const downloadUrl = await getDownloadURL(imageRef);
              await updateDoc(doc(db, "users", user.userId), {
                img: downloadUrl,
              });
            })
            .catch((err) => {
              setIsLoading(false);
            });
          // @ts-ignore
          blob.close();
        }
        // dispatch(setUser(useUserData(user.email)));
        console.log("Имя и фамилия обновлены!");
      });
      // getUserData(user.email);
      setIsEditMode(false);
      setIsLoading(false);
    } else {
      setError("Заполните поля!");
    }
  };

  // console.log(user);+

  return (
    <View style={tw("flex flex-col h-full relative")}>
      {/* Avatar + email */}
      <View
        style={tw(
          "flex px-8 pt-10 pb-6 flex-row items-center justify-between bg-slate-200"
        )}
      >
        <View style={tw("flex flex-col")}>
          {user.img !== "" || profileImage ? (
            <UserAvatar source={profileImage || user.img} />
          ) : (
            <UserAvatar title={user.name[0]} />
          )}
          {isEditMode && (
            <Text style={tw("underline -ml-5")} onPress={pickImage}>
              Изменить фото
            </Text>
          )}
        </View>
        <View>
          <Text style={tw("text-gray-800 text-lg")}>{user.email}</Text>
        </View>
      </View>
      {/* Name + Type */}
      <View style={tw("p-6")}>
        <Text style={tw("text-center text-lg")}>Личные данные</Text>
        <Card containerStyle={tw("rounded-sm")}>
          {!isEditMode ? (
            <View style={tw("flex flex-row items-center justify-between")}>
              <View>
                <View>
                  <Text style={tw("text-lg text-gray-800")}>{user.name}</Text>
                </View>
                <View>
                  <Text style={tw("text-lg text-gray-800")}>{user.female}</Text>
                </View>
              </View>
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
                      <Text style={tw("text-blue-400")}>
                        ({user.disciplines.length}){" "}
                      </Text>
                      предмета
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View>
              {error && (
                <Text style={tw("text-center text-red-400")}>{error}</Text>
              )}
              <View>
                <Text>Имя</Text>
                <Input
                  value={newName}
                  inputStyle={tw("")}
                  onChangeText={setNewName}
                />
              </View>
              <View>
                <Text>Фамилия</Text>
                <Input
                  value={newFemale}
                  inputStyle={tw("")}
                  onChangeText={setNewFemale}
                />
              </View>
            </View>
          )}
        </Card>
      </View>
      {/* Add info... */}
      <View>
        <View>
          {!isEditMode ? (
            <Text
              onPress={() => setIsEditMode(true)}
              style={tw("text-blue-400 underline text-center")}
            >
              Редактировать профиль
            </Text>
          ) : (
            <Text
              onPress={() => {
                saveNewData();
              }}
              style={tw("text-blue-400 underline text-center")}
            >
              {!isLoading ? "Сохранить данные" : "Загрузка..."}
            </Text>
          )}
        </View>
      </View>
      {/* Sign out */}
      {!isEditMode && (
        <View
          style={tw("flex flex-row justify-center absolute bottom-10 w-full")}
        >
          <Text
            style={tw(
              "bg-blue-400 px-2 py-1 text-white font-semibold rounded-md text-lg"
            )}
            onPress={() => signOut(auth)}
          >
            Выйти из аккаунта
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;
