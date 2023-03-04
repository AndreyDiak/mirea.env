import React, { useState } from "react";

import { View } from "react-native";

import { CheckBox, Input } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { createUser } from "../api";
import { LoginDialog, LoginDialogOpen, LoginForm } from "../components";
import {
   selectUserData,
   setFemale as setFemaleAction,
   setName as setNameAction,
   setUserType,
} from "../features/authSlice";
import { LFilter, UType } from "../typings/enums";
import { isEmpty } from "../utils";

export function AuthBioScreen() {
   const tw = useTailwind();
   const dispatch = useDispatch();

   const userData = useSelector(selectUserData);
   const [name, setName] = useState<string>("");
   const [female, setFemale] = useState<string>("");
   const [filter, setFilter] = useState<LFilter>(LFilter.INSTITUTES);
   const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
   const [error, setError] = useState<string>("");

   const toggleDialog = (dialogFilter: LFilter) => {
      setFilter(dialogFilter);
      setIsDialogVisible(!isDialogVisible);
   };

   const toggleUserType = (userType: UType) => {
      dispatch(setUserType({ type: userType }));
   };

   const registerHandler = async () => {
      dispatch(setNameAction({ name }));
      dispatch(setFemaleAction({ female }));
      await createUser({
         userData: {
            ...userData,
            name: name.trim(),
            female: female.trim(),
         },
         setError,
      });
   };

   return (
      <View style={tw("w-full h-full bg-slate-100 flex flex-row items-center justify-center")}>
         <LoginForm handleSubmit={registerHandler} step="bio" error={error}>
            <View style={tw("")}>
               <LoginDialog isVisible={isDialogVisible} filter={filter} toggleVisible={setIsDialogVisible} />
               <Input placeholder="Ваше имя..." value={name} onChangeText={setName} />
               <Input placeholder="Ваша фамилия..." value={female} onChangeText={setFemale} />
               <CheckBox
                  title="Я студент"
                  checked={userData.type === UType.STUDENT}
                  onPress={() => toggleUserType(UType.STUDENT)}
                  containerStyle={{ padding: 0 }}
               />
               <CheckBox
                  title="Я преподаватель"
                  checked={userData.type === UType.TEACHER}
                  onPress={() => toggleUserType(UType.TEACHER)}
                  containerStyle={{ padding: 0 }}
               />
               {/* Select user Institutesvb  */}
               {userData.type !== null && (
                  <View style={tw("text-blue-400 text-lg py-2")}>
                     <LoginDialogOpen
                        isSelected={!userData.institutes.length}
                        text="Выбрать институт"
                        subText={`Институт(ы): ${userData.institutes.map(
                           (institute) => `${institute.shortName} `,
                        )}`}
                        openDialog={() => toggleDialog(LFilter.INSTITUTES)}
                     />
                  </View>
               )}
               {userData.institutes?.length > 0 && (
                  <View style={tw("text-blue-400 text-lg py-2")}>
                     {userData.type === UType.STUDENT ? (
                        <LoginDialogOpen
                           isSelected={!isEmpty(userData.group)}
                           text="Выбрать группу"
                           subText={`Группа: ${userData.group?.name}`}
                           openDialog={() => toggleDialog(LFilter.GROUPS)}
                        />
                     ) : (
                        <LoginDialogOpen
                           isSelected={isEmpty(userData.disciplines)}
                           text="Выбрать предметы"
                           subText={`Выбрано: (${userData.disciplines?.length}) `}
                           openDialog={() => toggleDialog(LFilter.DISCIPLINES)}
                        />
                     )}
                  </View>
               )}
            </View>
         </LoginForm>
      </View>
   );
}
