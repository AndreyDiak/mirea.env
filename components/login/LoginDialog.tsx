import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Dialog } from "@rneui/themed";
import { CheckBox } from "@rneui/themed";

type Props = {
  isVisible: boolean;
  isStudent: boolean;
  disciplines: Discipline[];
  myDisciplines: any[];
  groups: any[];
  group: string;
  toggleVisible: (isVisible: boolean) => void;
  setGroup: (group: string) => void;
  setMyDisciplines: (myDisciplines: any[]) => void;
};

const LoginDialog = ({
  isStudent,
  isVisible,
  toggleVisible,
  groups,
  group,
  setGroup,
  disciplines,
  myDisciplines,
  setMyDisciplines,
}: Props) => {
  const tw = useTailwind();
  return (
    <View>
      <Dialog isVisible={isVisible} onBackdropPress={() => toggleVisible(!isVisible)}>
        <Dialog.Title
          title={isStudent ? "Выбрать группу" : "Выбрать предметы"}
          titleStyle={tw("text-center")}
        />
        {isStudent ? (
          <View style={tw("flex flex-col justify-center")}>
            {groups
              .sort((prev, next) => prev.name.localeCompare(next.name))
              .map(({ name }, index) => (
                <CheckBox
                  key={index}
                  title={name}
                  checked={name === group}
                  onPress={() => setGroup(name)}
                  containerStyle={tw("text-center")}
                />
              ))}
            <View style={tw("flex flex-row justify-center")}>
              <Text
                disabled={!group}
                onPress={() => toggleVisible(!isVisible)}
                style={tw(
                  `${
                    !!group ? "bg-blue-500" : "bg-gray-400"
                  } rounded-lg py-1 px-2 text-white text-lg`
                )}
              >
                Подтвердить
              </Text>
            </View>
          </View>
        ) : (
          <View>
            {disciplines.map((discipline, index) => {
              const i = myDisciplines.findIndex(
                (item) => item.title === discipline.name
              );
              return (
                <CheckBox
                  key={index}
                  title={discipline.name}
                  checked={i !== -1}
                  onPress={() => {
                    const disciplineCopy = [...myDisciplines];
                    if (i === -1) {
                      disciplineCopy.push({
                        id: discipline.id,
                        title: discipline.name,
                      });
                    } else {
                      disciplineCopy.splice(i, 1);
                    }
                    setMyDisciplines(disciplineCopy);
                  }}
                />
              );
            })}
            <View style={tw("flex flex-row justify-center")}>
              <Text
                disabled={!myDisciplines.length}
                onPress={() => toggleVisible(!isVisible)}
                style={tw(
                  `${
                    !!myDisciplines.length ? "bg-blue-500" : "bg-gray-400"
                  } rounded-lg py-1 px-2 text-white text-lg`
                )}
              >
                Подтвердить
              </Text>
            </View>
          </View>
        )}
      </Dialog>
    </View>
  );
};

export default LoginDialog;
