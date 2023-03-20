export interface Group {
   id: string;
   name: string;
   instituteId: string; // id института к которому подключена группа (может быть только 1)
   disciplinesIds: string[]; // id дисциплин к которым подключена группа
}

export interface FB_Group {
   name: string;
   institute_id: string;
   disciplines_ids: string[];
}
