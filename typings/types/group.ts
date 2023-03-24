export interface Group {
   id: string;
   name: string;
   instituteId: string; // id института к которому подключена группа (может быть только 1)
}

export interface FBGroup {
   id?: string;
   name: string;
   institute_id: string;
}
