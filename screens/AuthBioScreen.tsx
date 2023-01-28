import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CheckBox, Input } from "@rneui/themed";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { getAllDisciplines, getAllGroups } from "../api";

import { LoginDialog, LoginForm } from "../components";
import { auth, db } from "../firebase";

type AuthBioScreenRouteProp = RouteProp<RootStackParamList, "AuthBio">;

// TODO вынести регистрацию в api

// TODO делаем сначала выбор института
// если type === 'student' можем выбрать только один институт а если type === 'teacher'
// то можно выбрать несколько институтов
// потом мы запрашиваем все группы которые есть в этом институте для student
// либо запрашиваем все дисциплины которые есть для teacher

export const AuthBioScreen = () => {
  const tw = useTailwind();
  const [name, setName] = useState<string>("");
  const [female, setFemale] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(true);
  // only for students
  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<Group>(null);
  // only for teachers
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [myDisciplines, setMyDisciplines] = useState<any[]>([]);

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const navigation = useNavigation<AuthBioScreenNavigatorProp>();

  useEffect(() => {
    const getData = async () => {
      const disciplines = await getAllDisciplines();
      const groups = await getAllGroups();

      setDisciplines(disciplines);
      setGroups(groups);
    };

    getData();
  }, []);

  const {
    params: { email, password },
  } = useRoute<AuthBioScreenRouteProp>();

  // console.log("email: " + email);

  const toggleDialog = () => setIsDialogVisible(!isDialogVisible);

  const register = async () => {
    if (name === "") {
      setError("Введите имя");
      return;
    }
    if (female === "") {
      setError("Введите фамилию");
      return;
    }
    if (isStudent && group === null) {
      setError("Выберите группу");
      return;
    }
    if (!isStudent && myDisciplines.length === 0) {
      setError("Выберите дисциплины");
      return;
    }
    let user = isStudent
      ? {
          email: email.toLowerCase(),
          name: name,
          female: female,
          password: password,
          img: "",
          groupId: group,
          type: "student",
        }
      : {
          email: email.toLowerCase(),
          name: name,
          female: female,
          password: password,
          img: "",
          disciplines: myDisciplines,
          type: "teacher",
        };

    await createUserWithEmailAndPassword(auth, email, password).then(
      async (res) => {
        console.log("user created!");
        await addDoc(collection(db, "users"), {
          ...user,
        });
      }
    );
  };

  return (
    <View
      style={tw(
        "w-full h-full bg-slate-100 flex flex-row items-center justify-center"
      )}
    >
      <LoginForm handleSubmit={register} step="bio" error={error}>
        <View style={tw("")}>
          <LoginDialog
            isStudent={isStudent}
            isVisible={isDialogVisible}
            toggleVisible={setIsDialogVisible}
            group={group}
            groups={groups}
            disciplines={disciplines}
            myDisciplines={myDisciplines}
            setGroup={setGroup}
            setMyDisciplines={setMyDisciplines}
          />
          <Input
            placeholder="Ваше имя..."
            value={name}
            onChangeText={setName}
            containerStyle={{ margin: 0 }}
          />
          <Input
            placeholder="Ваша фамилия..."
            value={female}
            onChangeText={setFemale}
          />
          <CheckBox
            title="Я студент"
            checked={isStudent}
            onPress={() => {
              setIsStudent(true);
              setGroup(null);
              setMyDisciplines([]);
            }}
            containerStyle={{ padding: 0 }}
          />
          <CheckBox
            title="Я преподаватель"
            checked={!isStudent}
            onPress={() => {
              setIsStudent(false);
              setGroup(null);
              setMyDisciplines([]);
            }}
            containerStyle={{ padding: 0 }}
          />

          <View>
            <View style={tw("text-blue-400 text-lg py-2")}>
              {isStudent ? (
                <>
                  {!group ? (
                    <Text
                      style={tw("text-blue-400 text-lg text-center")}
                      onPress={toggleDialog}
                    >
                      Выбрать группу
                    </Text>
                  ) : (
                    <View style={tw("flex flex-row justify-center")}>
                      <Text>Группа: {group.name} </Text>
                      <Text
                        style={tw("text-blue-400 underline")}
                        onPress={toggleDialog}
                      >
                        Изменить
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  {!myDisciplines.length ? (
                    <Text
                      style={tw("text-blue-400 text-lg text-center")}
                      onPress={toggleDialog}
                    >
                      Выбрать предметы
                    </Text>
                  ) : (
                    <View style={tw("flex flex-row justify-center")}>
                      <Text>Выбрано: ({myDisciplines.length}) </Text>
                      <Text
                        style={tw("text-blue-400 underline")}
                        onPress={toggleDialog}
                      >
                        Изменить
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </LoginForm>
    </View>
  );
};
