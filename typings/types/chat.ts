export interface Chat {
   disciplineId: string;
   groupId: string;
   id: string;
}

export interface FB_Chat {
   discipline_id: string;
   group_id: string;
}

export type Chat_Preview = Omit<Chat, "disciplineId"> & {
   groupName: string;
};
