/* eslint-disable no-param-reassign */
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { FBSource } from "../../typings";

interface InitialState {
   // по id дисциплины храним материалы
   documents: Record<string, FBSource[]>;
}

const initialState: InitialState = {
   documents: {},
};

export const documentsSlice = createSlice({
   name: "documents",
   initialState,
   reducers: {
      setDocuments: (state, action: PayloadAction<{ documents: FBSource[]; materialId: string }>) => {
         const { documents, materialId } = action.payload;
         state.documents[materialId] = documents;
      },
   },
});

export const selectDocuments = (state: RootState) => state.documents.documents;

export const selectDocumentsByMaterialId = createSelector(
   (s: RootState, materialId: string) => materialId,
   selectDocuments,
   (materialId, documents) => documents[materialId] ?? [],
);

// Action creators are generated for each case reducer function
export const { setDocuments } = documentsSlice.actions;

export default documentsSlice.reducer;
