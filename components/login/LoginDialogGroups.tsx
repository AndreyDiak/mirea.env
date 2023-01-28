import { CheckBox } from "@rneui/themed";
import React from "react";
import { FlatList, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { Error, Loader } from "../common";

interface Props {
  groups: Group[];
  myGroup: Group | null;
  isLoading: boolean;
  setMyGroup: (group: Group) => void;
}

export const LoginDialogGroups: React.FC<Props> = React.memo(
  ({ groups, myGroup, setMyGroup, isLoading }) => {
    const tw = useTailwind();

    const renderData = () => {
      if (isLoading) {
        return <Loader text="Загрузка доступных групп" theme="blue" />;
      }
      if (!groups.length) {
        return <Error text={"Группы не найдены"} theme="blue" />;
      }

      return (
        <FlatList
          data={groups.sort((prev, next) => prev.name.localeCompare(next.name))}
          scrollEnabled
          // style={tw("max-h-[350px]")}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <CheckBox
              key={index}
              title={item.name}
              checked={myGroup !== null && item.id === myGroup.id}
              onPress={() => setMyGroup(item)}
              containerStyle={tw("text-center")}
            />
          )}
        />
      );
    };

    return <View style={tw("max-h-[350px]")}>{renderData()}</View>;
  }
);
