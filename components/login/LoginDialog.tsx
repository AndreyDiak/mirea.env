import { Dialog } from "@rneui/themed";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";

import { useDialogLoader } from "../../hooks/login";
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
  filter: LFilter;

  toggleVisible: (isVisible: boolean) => void;
}

export const LoginDialog: React.FC<Props> = React.memo(({ isVisible, toggleVisible, filter }) => {
  const tw = useTailwind();

  const submitButtonDisabled = useDialogLoader(filter);

  const renderList = () => {
    switch (filter) {
      case LFilter.INSTITUTES:
        return <LoginDialogInstitutes />;
      case LFilter.GROUPS:
        return <LoginDialogGroups filter={filter} />;
      case LFilter.DISCIPLINES:
        return <LoginDialogDisciplines filter={filter} />;
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
                `${
                  submitButtonDisabled ? "bg-blue-500" : "bg-gray-400"
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
});
