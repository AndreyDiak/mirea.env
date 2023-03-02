// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = Array<any> | object | number | string;

export const isEmpty = (data: Data): boolean => {
   // проверка если это массив
   if (Array.isArray(data)) {
      return data.length === 0;
   }
   // проверка на пустой объект
   if (typeof data === "object") {
      return Object.keys(data).length === 0;
   }
   // проверка числа
   if (typeof data === "number") {
      return data === 0;
   }
   // проверка строки
   if (typeof data === "string") {
      return data === "";
   }
   // другие типы данных null | undefined
   if (data) {
      return true;
   }

   return false;
};
