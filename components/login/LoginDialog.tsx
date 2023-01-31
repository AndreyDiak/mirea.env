import { Dialog } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import { Text, Touchable, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";

import { useInstitutes, useDisciplines, useGroups } from "../../hooks/login/";
import { LFilter } from "../../typings/enums";
import { LoginDialogDisciplines } from "./LoginDialogDisciplines";
import { LoginDialogGroups } from "./LoginDialogGroups";
import { LoginDialogInstitutes } from "./LoginDialogInstitutes";

const titleMap: Record<LFilter, string> = {
  disciplines: "Выбрать предметы",
  groups: "Выбрать группу",
  institutes: "Выбрать институт(ы)",
};

interface Props {
  isVisible: boolean;
  isStudent: boolean;
  myDisciplines: string[];
  myGroup: Group;
  myInstitutes: Institute[];
  filter: LFilter;

  toggleVisible: (isVisible: boolean) => void;
  setMyGroup: (group: Group) => void;
  setMyDisciplines: (myDisciplines: string[]) => void;
  setMyInstitutes: (myInstitutes: Institute[]) => void;
};

export const LoginDialog: React.FC<Props> = React.memo(({
  isStudent,
  isVisible,
  toggleVisible,
  filter,
  myGroup,
  setMyGroup,
  myDisciplines,
  setMyDisciplines,
  myInstitutes,
  setMyInstitutes,
}) => {
  const tw = useTailwind();
  const { institutes, loading: ILoading } = useInstitutes();

  const { disciplines, loading: DLoading } = useDisciplines(myInstitutes, filter);

  const totalDisciplinesCount = !!disciplines
    ? Object.values(disciplines).reduce((total, d) => total + d.length, 0)
    : 0;

  const { groups, loading: GLoading } = useGroups(myInstitutes, filter);

  const submitButtonDisabled =
    (filter === LFilter.DISCIPLINES && !!myDisciplines.length && totalDisciplinesCount > 0) ||
    (filter === LFilter.GROUPS && !!myGroup && groups.length > 0) ||
    (filter === LFilter.INSTITUTES && !!myInstitutes.length && institutes.length > 0) ||
    (filter === LFilter.DISCIPLINES && totalDisciplinesCount === 0 && !DLoading) ||
    (filter === LFilter.GROUPS && groups.length === 0 && !GLoading) ||
    (filter === LFilter.INSTITUTES && institutes.length === 0 && !ILoading);

  const toggleInstitutesHandler = (myInstitutes: Institute[]) => {
    setMyInstitutes(myInstitutes);
    // в идеале надо проверять, что если мы студент
    // и мы выбираем новый институт, то тогда мы зануляем выбранную группу,
    // а если мы преподователь то мы должны проверять, что если мы убрали институт, 
    // откуда мы брали дисциплины, то мы должны их удалять
    setMyGroup(null);
    setMyDisciplines([]);
  };

  const renderList = () => {
    switch (filter) {
      case LFilter.INSTITUTES:
        return (
          <LoginDialogInstitutes
            isStudent={isStudent}
            institutes={institutes}
            myInstitutes={myInstitutes}
            setMyInstitutes={toggleInstitutesHandler}
          />
        );
      case LFilter.GROUPS:
        return (
          <LoginDialogGroups
            groups={groups && groups.sort((prev, next) => prev.name.localeCompare(next.name))}
            myGroup={myGroup}
            setMyGroup={setMyGroup}
            isLoading={GLoading}
          />
        );
      case LFilter.DISCIPLINES:
        return (
          <LoginDialogDisciplines
            disciplines={disciplines}
            myDisciplines={myDisciplines}
            setMyDisciplines={setMyDisciplines}
            isLoading={DLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View>
      <Dialog isVisible={isVisible} onBackdropPress={() => toggleVisible(!isVisible)}>
        <Dialog.Title title={titleMap[filter]} titleStyle={tw("text-center")} />
        {renderList()}
        <View style={tw("flex flex-row justify-center")}>
          <TouchableOpacity
            disabled={!submitButtonDisabled}
            onPress={() => toggleVisible(!isVisible)}
          >
            <Text
              style={tw(
                `${submitButtonDisabled ? "bg-blue-500" : "bg-gray-400"
                } rounded-lg py-1 px-2 text-white text-lg`
              )}
            >
              Подтвердить
            </Text>
          </TouchableOpacity>
        </View>
      </Dialog>
    </View>
  );
})
