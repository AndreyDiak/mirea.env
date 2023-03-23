export interface Chat {
   id: string;
   disciplineId: string;
   groupId: string;
}

export interface FBChat {
   id?: string;
   discipline_id: string;
   group_id: string;
}

export type ChatPreview = Omit<Chat, "disciplineId"> & {
   groupName: string;
};
