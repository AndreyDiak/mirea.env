import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import React from "react";

import { View, TouchableOpacity } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { handleFavorite } from "../../../api";

interface Props {
  userId: string;
  material: Material;
  isFavorite: boolean;
}

export const MaterialMenu: React.FC<Props> = ({
  userId,
  material,
  isFavorite,
}) => {
  const tw = useTailwind();
  const navigation = useNavigation<DisciplineScreenNavigatorProp>();
  // еще не реализовано
  const onReplyClick = async () => {
    // if (userType === "teacher") {
    //   navigation.navigate();
    // } else {
    //   // userType === 'student'
    // }
  };
  return (
    <View style={tw("flex flex-row justify-end items-center mb-2")}>
      {/* Add / Remove to Favorites... */}
      <TouchableOpacity
        style={tw("mr-4")}
        onPress={() => handleFavorite(userId, material.id, isFavorite)}
      >
        {isFavorite ? (
          <Icon name="favorite" type="material" size={25} color="#f87171" />
        ) : (
          <Icon name="favorite-border" type="material" size={25} color="gray" />
        )}
      </TouchableOpacity>
      {/* Open comments... */}
      <TouchableOpacity
        style={tw("mr-4")}
        onPress={() => navigation.navigate("Comments", { material })}
      >
        <Icon name="comment" type="material" size={25} color="gray" />
      </TouchableOpacity>
      {/* Reply */}
      <TouchableOpacity onPress={onReplyClick}>
        <Icon name="reply" type="material" size={25} color="gray" />
      </TouchableOpacity>
    </View>
  );
};
