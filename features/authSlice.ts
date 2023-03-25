/* eslint-disable no-param-reassign */
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";
import type { Discipline, Group, Institute } from "../typings";
import { USER_THEME, USER_TYPE } from "../typings/enums";

export interface AuthState {
   email: string;
   password: string;
   type: USER_TYPE;
   name: string;
   female: string;
   img: string;
   theme: USER_THEME;
   institutes: Institute[]; // array of institutes
   // STUDENT
   group: Group; // group obj
   // TEACHER
   disciplines: string[]; // disciplines IDs
}

const initialState: AuthState = {
   email: null,
   password: null,
   type: null,
   name: null,
   female: null,
   img: "",
   theme: USER_THEME.BLUE,
   group: null,
   disciplines: [],
   institutes: [],
};

export const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setEmail: (state, action: PayloadAction<{ email: string }>) => {
         state.email = action.payload.email;
      },
      setPassword: (state, action: PayloadAction<{ password: string }>) => {
         state.password = action.payload.password;
      },
      setName: (state, action: PayloadAction<{ name: string }>) => {
         state.name = action.payload.name;
      },
      setFemale: (state, action: PayloadAction<{ female: string }>) => {
         state.password = action.payload.female;
      },
      setUserType: (state, action: PayloadAction<{ type: USER_TYPE }>) => {
         // при смене типа пользователя зануляем выбранные институты
         if (state.type !== action.payload.type && state.type !== null) {
            state.institutes = [];
            state.disciplines = [];
            state.group = null;
         }
         state.type = action.payload.type;
      },
      setInstitutes: (state, action: PayloadAction<{ institute: Institute }>) => {
         if (state.type === USER_TYPE.STUDENT) {
            state.institutes = [action.payload.institute];
         } else {
            // проверка выбран ли уже этот институт
            const instituteAlreadyTaken = state.institutes.some(
               (item) => item.id === action.payload.institute.id,
            );
            if (instituteAlreadyTaken) {
               state.institutes = state.institutes.filter(
                  (institute) => institute.id !== action.payload.institute.id,
               );
            } else {
               state.institutes.push(action.payload.institute);
            }
         }
      },
      setDisciplines: (state, action: PayloadAction<{ discipline: Discipline }>) => {
         const disciplineAlreadyTaken = state.disciplines.some(
            (item) => item === action.payload.discipline.id,
         );
         if (disciplineAlreadyTaken) {
            state.disciplines = state.disciplines.filter(
               (discipline) => discipline !== action.payload.discipline.id,
            );
         } else {
            state.disciplines.push(action.payload.discipline.id);
         }
      },
      setGroup: (state, action: PayloadAction<{ group: Group }>) => {
         state.group = action.payload.group;
      },
   },
});

export const selectUserInstitutes = (state: RootState) => state.auth.institutes;

export const selectUserDisciplines = (state: RootState) => state.auth.disciplines;

export const selectUserGroup = (state: RootState) => state.auth.group;

export const selectUserData = (state: RootState) => state.auth;

// Action creators are generated for each case reducer function
export const {
   setEmail,
   setPassword,
   setUserType,
   setInstitutes,
   setDisciplines,
   setGroup,
   setFemale,
   setName,
} = authSlice.actions;

export default authSlice.reducer;
