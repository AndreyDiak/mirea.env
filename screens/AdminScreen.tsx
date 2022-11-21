import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Card } from "@rneui/themed";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import AddGroupForm from "../components/forms/AddGroupForm";
import AddDisciplineForm from "../components/forms/AddDisciplineForm";
import AddTimetableForm from "../components/forms/AddTimetableForm";

type Props = {};

const AdminScreen = (props: Props) => {
  const tw = useTailwind();

  const [isTimetableFormVisible, setIsTimetableFormVisible] = useState(false);
  const [isDisciplineFormVisible, setIsDisciplineFormVisible] = useState(false);
  const [isGroupFormVisible, setIsGroupFormVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const openMenu = () => {
    setIsMenuVisible(false);
    setIsDisciplineFormVisible(false);
    setIsGroupFormVisible(false);
    setIsTimetableFormVisible(false);
  };

  return (
    <View style={tw("pt-10 px-4")}>
      {/* Screen title */}
      <View style={tw("flex flex-row items-center text-lg justify-between")}>
        <Text style={tw("my-2 text-center text-xl font-semibold")}>
          Админская панель
        </Text>
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Text style={tw("underline text-blue-400 font-bold")}>Выйти</Text>
        </TouchableOpacity>
      </View>

      {/* Variants */}
      <View style={tw("")}>
        <Card>
          <View style={tw("flex flex-row justify-between items-center mb-2")}>
            <View>
              <Text style={tw("text-lg")}>Список возможностей</Text>
            </View>
            {isMenuVisible && (
              <TouchableOpacity onPress={openMenu}>
                <Text style={tw("text-blue-400")}>Открыть</Text>
              </TouchableOpacity>
            )}
          </View>

          {!isMenuVisible && (
            <View>
              <Card.Divider />
              <View style={tw("mb-2")}>
                <TouchableOpacity
                  onPress={() => {
                    setIsTimetableFormVisible(true);
                    setIsMenuVisible(true);
                  }}
                >
                  <Text style={tw("text-blue-400")}>Добавить расписание</Text>
                </TouchableOpacity>
              </View>
              <View style={tw("mb-2")}>
                <TouchableOpacity
                  onPress={() => {
                    setIsDisciplineFormVisible(true);
                    setIsMenuVisible(true);
                  }}
                >
                  <Text style={tw("text-blue-400")}>Добавить дисциплину</Text>
                </TouchableOpacity>
              </View>
              <View style={tw("mb-2")}>
                <TouchableOpacity
                  onPress={() => {
                    setIsGroupFormVisible(true);
                    setIsMenuVisible(true);
                  }}
                >
                  <Text style={tw("text-blue-400")}>Добавить группу</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>
      </View>
      {/* Forms */}
      <View>
        {isGroupFormVisible && <AddGroupForm />}
        {isDisciplineFormVisible && <AddDisciplineForm />}
        {isTimetableFormVisible && <AddTimetableForm />}
      </View>
    </View>
  );
};

export default AdminScreen;
