import { View, Text, FlatList } from "react-native";
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

  const updateMyDisciplines = (discipline: Discipline, i: number) => {
    const disciplineCopy = [...myDisciplines];
    // сохраняем только id дисциплин
    if (i === -1) { 
      disciplineCopy.push({
        id: discipline.id,
      });
    } else {
      disciplineCopy.splice(i, 1);
    }
    setMyDisciplines(disciplineCopy);
  }

  return (
    <View>
      <Dialog isVisible={isVisible} onBackdropPress={() => toggleVisible(!isVisible)}>
        <Dialog.Title
          title={isStudent ? "Выбрать группу" : "Выбрать предметы"}
          titleStyle={tw("text-center")}
        />
        {isStudent ? (
          <View>
            {/* render all groups */}
            {/* TODO сделать сначала выбор института потом выбирать группы в нем... */}
            <FlatList
              data={groups
                .sort((prev, next) => prev.name.localeCompare(next.name))}
              scrollEnabled
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <CheckBox
                  key={index}
                  title={item.name}
                  checked={item.name === group}
                  onPress={() => setGroup(item.name)}
                  containerStyle={tw("text-center")}
                />
              )}
            />
            <View style={tw("flex flex-row justify-center")}>
              <Text
                disabled={!group}
                onPress={() => toggleVisible(!isVisible)}
                style={tw(
                  `${!!group ? "bg-blue-500" : "bg-gray-400"
                  } rounded-lg py-1 px-2 text-white text-lg`
                )}
              >
                Подтвердить
              </Text>
            </View>
          </View>
        ) : (
          <View>
            {/* render all disciolines */}
            {/* TODO сделать сначала выбор института а потом уже привязанных к нему дисциплин */}
            <FlatList
              data={disciplines}
              scrollEnabled
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const i = myDisciplines.findIndex(
                  (item) => item.title === item.name
                );
                return (
                  <CheckBox
                    key={index}
                    title={item.name}
                    checked={i !== -1}
                    onPress={() => updateMyDisciplines(item, i)}
                  />
                )
              }}
            />
            <View style={tw("flex flex-row justify-center")}>
              <Text
                disabled={!myDisciplines.length}
                onPress={() => toggleVisible(!isVisible)}
                style={tw(
                  `${!!myDisciplines.length ? "bg-blue-500" : "bg-gray-400"
                  } rounded-lg py-1 px-2 text-white text-lg`
                )}
              >
                Подтвердить
              </Text>
            </View>
          </View>
        )}
      </Dialog>
    </View >
  );
};

export default LoginDialog;
