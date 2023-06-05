import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackScreenProps } from "@react-navigation/stack";

import { Material } from "./types";
import { Discipline } from "./types/discipline";

export interface Timestamp {
   toDate(): any;
   seconds: number;
   nanoseconds: number;
}

export type RootStackParamList = {
   Login: undefined;
   AuthInfo: undefined;
   AuthBio: undefined;
   Main: undefined;
   User: {
      userId: string;
   };
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
   Search: undefined;
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

// NativeStackNavigationProp<>   для useNavigation()
// RouteProp<>    для useRoute()

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;
export type AuthInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "AuthInfo">;
export type AuthBioScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "AuthBio">;

export type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export type DisciplineScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Discipline">;
export type DisciplineScreenRouteProp = RouteProp<RootStackParamList, "Discipline">;

export type CommentsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Comments">;
export type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">;

export type ChatsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Chats">;
export type ChatsScreenRouteProp = RouteProp<RootStackParamList, "Chats">;

export type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Chat">;
export type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;
