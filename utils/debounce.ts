/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-return-assign */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
   let timeout;

   const debounced = (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), waitFor);
   };

   return debounced as (...args: Parameters<F>) => ReturnType<F>;
};
