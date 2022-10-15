import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CheckBox, Input } from "@rneui/themed";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection, getDocs,
  query
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import LoginDialog from "../components/LoginDialog";
import LoginForm from "../components/LoginForm";
import { auth, db } from "../firebase";

type Props = {};
type AuthBioScreenRouteProp = RouteProp<RootStackParamList, "AuthBio">;
const AuthBioScreen = (props: Props) => {
  const tw = useTailwind();
  const [name, setName] = useState<string>("");
  const [female, setFemale] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [group, setGroup] = useState<string>("");
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [myDisciplines, setMyDisciplines] = useState<any[]>([]);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigation = useNavigation<AuthBioScreenNavigatorProp>();

  useEffect(() => {
    const getGroups = async () => {
      const q = query(collection(db, "groups"));
      const querySnap = await getDocs(q);

      let initialGroups: any[] = [];
      querySnap.forEach((doc) => {
        initialGroups = [
          ...initialGroups,
          {
            id: doc.id,
            ...doc.data(),
          },
        ];
      });
      setGroups(initialGroups);
    };

    const getDisciplines = async () => {
      const q = query(collection(db, "disciplines"));
      const querySnap = await getDocs(q);

      let initialDisciplines: any[] = [];
      querySnap.forEach((doc) => {
        initialDisciplines = [
          ...initialDisciplines,
          {
            id: doc.id,
            ...doc.data(),
          },
        ];
      });
      setDisciplines(initialDisciplines);
    };

    getGroups();
    getDisciplines();
  }, []);

  const {
    params: { email, password },
  } = useRoute<AuthBioScreenRouteProp>();

  // console.log("email: " + email);

  const toggleDialog = () => setIsDialogVisible(!isDialogVisible);

  const register = async () => {
    if(name === '') {
      setError('Введите имя')
      return
    }
    if(female === '') {
      setError('Введите фамилию')
      return
    }
    if(isStudent && group === '') {
      setError('Выберите группу')
      return
    }
    if(!isStudent && myDisciplines.length === 0) {
      setError('Выберите дисциплины')
      return
    }
    let user = isStudent
      ? {
          email: email,
          name: name,
          female: female,
          password: password,
          img: "",
          group: group,
          type: "student",
        }
      : {
          email: email,
          name: name,
          female: female,
          password: password,
          img: "",
          disciplines: myDisciplines,
          type: "teacher",
        };

    await createUserWithEmailAndPassword(auth, email, password).then(
      async (res) => {
        console.log(res);
        await addDoc(
          collection(db,`users/${isStudent ? "students" : "teachers"}/collection`),
          {
            ...user,
            userId: res.user.uid,
          }
        );
        await addDoc(collection(db, "users/list/collection"), {
          email: user.email,
          userId: res.user.uid
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
              setGroup("");
              setMyDisciplines([]);
            }}
            containerStyle={{ padding: 0 }}
          />
          <CheckBox
            title="Я преподаватель"
            checked={!isStudent}
            onPress={() => {
              setIsStudent(false);
              setGroup("");
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
                      <Text>Группа: {group} </Text>
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

export default AuthBioScreen;
