/* eslint-disable no-param-reassign */
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBLesson } from "../../typings";

interface InitialState {
   // по id дисциплины храним материалы...
   lessons: FBLesson[];
}

const initialState: InitialState = {
   lessons: [],
};

export const timetableSlice = createSlice({
   name: "timetable",
   initialState,
   reducers: {
      setLessons: (state, action: PayloadAction<{ lessons: FBLesson[] }>) => {
         const { lessons } = action.payload;
         state.lessons = lessons;
      },
   },
});

export const selectLessons = (state: RootState) => state.timetable.lessons;

export const selectLessonsForStudent = createSelector(
   (s: RootState, groupId: string) => groupId,
   selectLessons,
   (groupId, lessons) => lessons.filter((lesson) => lesson.groups_ids.includes(groupId)),
);

export const selectLessonsForTeacher = createSelector(
   (s: RootState, teacherId: string) => teacherId,
   selectLessons,
   (teacherId, lessons) => lessons.filter((lesson) => lesson.teachers_ids.includes(teacherId)),
);

// Action creators are generated for each case reducer function
export const { setLessons } = timetableSlice.actions;

export default timetableSlice.reducer;
