import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import LoginForm from "../components/LoginForm";
import { Input } from "@rneui/themed";
import { CheckBox } from "@rneui/themed";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import LoginDialog from "../components/LoginDialog";
import { async } from "@firebase/util";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
    const user = isStudent ? {
      email: email,
      name: name,
      female: female,
      password: password,
      group: group,
      img: '',
      type: 'student'
    } : {
      email: email,
      name: name,
      female: female,
      password: password,
      disciplines: myDisciplines,
      img: '',
      type: 'teacher'
    };

    const result = await addDoc(collection(db, `users/${isStudent ? 'students' : 'teachers'}/collection`), user)
    await createUserWithEmailAndPassword(auth, email, password).then(log => console.log(log));
    console.log(result);
    // navigation.navigate('Login')
  };

  return (
    <View
      style={tw(
        "w-full h-full bg-slate-100 flex flex-row items-center justify-center"
      )}
    >
      <LoginForm handleSubmit={register} step="bio">
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
