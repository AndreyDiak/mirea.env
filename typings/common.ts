import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";

import { Material } from "./types";
import { Discipline } from "./types/discipline";

export interface Timestamp {
   toDate(): import("moment").MomentInput;
   seconds: number;
   nanoseconds: number;
}

export type RootStackParamList = {
   Login: undefined;
   AuthInfo: undefined;
   AuthBio: undefined;
   Main: undefined;
   Discipline: {
      discipline: Discipline;
   };
   Chats: {
      discipline: Discipline;
   };
   Comments: {
      material: Material;
   };
   Chat: {
      groupName: string;
      chatId: string;
   };
};

export type TabStackParamList = {
   Profile: undefined;
   Disciplines: undefined;
   Timetable: undefined;
   Favorites: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
   RootStackParamList,
   T
>;

export type HomeTabScreenProps<T extends keyof TabStackParamList> = CompositeScreenProps<
   BottomTabScreenProps<TabStackParamList, T>,
   RootStackScreenProps<keyof RootStackParamList>
>;
