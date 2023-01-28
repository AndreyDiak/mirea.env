import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CheckBox, Input } from "@rneui/themed";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { createUser } from "../api/auth/mutations/createUser";

import { LoginDialog, LoginForm } from "../components";
import { LoginDialogOpen } from "../components/login/LoginDialogOpen";
import { LFilter } from "../typings/enums";

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

  const [filter, setFilter] = useState<LFilter>(LFilter.INSTITUTES);

  const [selectedInstitutes, setSelectedInstitutes] = useState<Institute[]>([]);
  // only for students
  const [selectedGroup, setSelectedGroup] = useState<Group>(null);

  // only for teachers (ids of linked disciplines)
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigation = useNavigation<AuthBioScreenNavigatorProp>();

  const {
    params: { email, password },
  } = useRoute<AuthBioScreenRouteProp>();

  const toggleDialog = (filter: LFilter) => {
    setFilter(filter);
    setIsDialogVisible(!isDialogVisible);
  };

  const toggleUserTypeHandler = (isStudent: boolean) => {
    setIsStudent(isStudent);
    setSelectedGroup(null);
    setSelectedDisciplines([]);
    setSelectedInstitutes([]);
  };

  const register = async () => {
    const data: NewUser = {
      email: email.toLowerCase(),
      name,
      female,
      password,
      img: "",
      theme: "blue",
    };

    await createUser({
      data,
      isStudent,
      group: selectedGroup,
      disciplines: selectedDisciplines,
      setError,
    });
  };

  return (
    <View style={tw("w-full h-full bg-slate-100 flex flex-row items-center justify-center")}>
      <LoginForm handleSubmit={register} step="bio" error={error}>
        <View style={tw("")}>
          <LoginDialog
            isStudent={isStudent}
            isVisible={isDialogVisible}
            filter={filter}
            toggleVisible={setIsDialogVisible}
            myGroup={selectedGroup}
            myDisciplines={selectedDisciplines}
            myInstitutes={selectedInstitutes}
            setMyGroup={setSelectedGroup}
            setMyDisciplines={setSelectedDisciplines}
            setMyInstitutes={setSelectedInstitutes}
          />
          <Input
            placeholder="Ваше имя..."
            value={name}
            onChangeText={setName}
            containerStyle={{ margin: 0 }}
          />
          <Input placeholder="Ваша фамилия..." value={female} onChangeText={setFemale} />
          <CheckBox
            title="Я студент"
            checked={isStudent}
            onPress={() => toggleUserTypeHandler(true)}
            containerStyle={{ padding: 0 }}
          />
          <CheckBox
            title="Я преподаватель"
            checked={!isStudent}
            onPress={() => toggleUserTypeHandler(false)}
            containerStyle={{ padding: 0 }}
          />
          {/* Select Group or disciplines */}
          <View style={tw("text-blue-400 text-lg py-2")}>
            <LoginDialogOpen
              isSelected={!selectedInstitutes.length}
              text={"Выбрать институт"}
              subText={`Институт(ы): ${selectedInstitutes.map(
                (institute) => `${institute.shortName} `
              )}`}
              openDialog={() => toggleDialog(LFilter.INSTITUTES)}
            />
          </View>
          {!!selectedInstitutes.length && (
            <View style={tw("text-blue-400 text-lg py-2")}>
              {isStudent ? (
                <LoginDialogOpen
                  isSelected={!selectedGroup}
                  text={"Выбрать группу"}
                  subText={`Группа: ${selectedGroup && selectedGroup.name}`}
                  openDialog={() => toggleDialog(LFilter.GROUPS)}
                />
              ) : (
                <LoginDialogOpen
                  isSelected={!selectedDisciplines.length}
                  text={"Выбрать предметы"}
                  subText={`Выбрано: (${selectedDisciplines.length}) `}
                  openDialog={() => toggleDialog(LFilter.DISCIPLINES)}
                />
              )}
            </View>
          )}
        </View>
      </LoginForm>
    </View>
  );
};
