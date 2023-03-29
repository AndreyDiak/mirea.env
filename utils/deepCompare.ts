function isObject(obj: any) {
   return Object.prototype.toString.call(obj) === "[object Object]";
}

function isArray(arr: any) {
   return Array.isArray(arr);
}

function isSameType(item1: any, item2: any) {
   return Object.prototype.toString.call(item1) === Object.prototype.toString.call(item2);
}

export function deepCompare<T extends object>(obj1: T, obj2: T): boolean {
   if (obj1 === obj2) {
      return true;
   }

   if ((!isObject(obj1) && !isArray(obj1)) || (!isObject(obj2) && !isArray(obj2))) {
      return false;
   }

   if (!isSameType(obj1, obj2) || Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
   }

   // eslint-disable-next-line no-restricted-syntax
   for (const key of Object.keys(obj1)) {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
         return false;
      }

      if (!deepCompare(obj1[key], obj2[key])) {
         return false;
      }
   }

   return true;
}
