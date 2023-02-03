import { CheckBox } from "@rneui/themed";
import React from "react";
import { FlatList, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import { selectUserGroup, selectUserInstitutes, setGroup } from "../../features/authSlice";
import { useGroups } from "../../hooks/login";
import { Group } from "../../typings";
import { LFilter } from "../../typings/enums";
import { Error, Loader } from "../common";

interface Props {
  filter: LFilter;
}

export const LoginDialogGroups: React.FC<Props> = React.memo(({ filter }) => {
  const tw = useTailwind();
  const dispatch = useDispatch();
  const myInstitutes = useSelector(selectUserInstitutes);
  const myGroup = useSelector(selectUserGroup);
  const { groups, loading: ILoading } = useGroups(myInstitutes, filter);

  const toggleMyGroup = (group: Group) => {
    dispatch(setGroup({ group }));
  };

  const renderData = () => {
    if (ILoading) {
      return <Loader text="Загрузка доступных групп" theme="blue" />;
    }
    if (!groups.length) {
      return <Error text={"Группы не найдены"} theme="blue" />;
    }

    return (
      <FlatList
        data={groups.sort((prev, next) => prev.name.localeCompare(next.name))}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item: group, index }) => (
          <CheckBox
            key={index}
            title={group.name}
            checked={group.id === myGroup?.id}
            onPress={() => toggleMyGroup(group)}
            containerStyle={tw("text-center")}
          />
        )}
      />
    );
  };

  return <View style={tw("max-h-[350px]")}>{renderData()}</View>;
});
