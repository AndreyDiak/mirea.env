import { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getAllDataWithFilter } from "../../api";
import { RootState } from "../../store";
import { DB_PATHS, FBAppUser, FBTeacher, Teacher, USER_TYPE, UseCustomHook } from "../../typings";
import { QUERIES, UserConverter, isEmpty } from "../../utils";
import { selectTeachers, setSearchData } from "../slices/searchSlice";

interface UseSearch extends UseCustomHook {
   search: string;
   searchInstitutes: Set<string>;
   teachers: Teacher[];
   onChange(search: string): void;
   onInstitutesChange(institute: string): void;
}

export function useSearch(): UseSearch {
   const dispatch = useDispatch();

   const rawTeachersSelector = useCallback((s: RootState) => selectTeachers(s), []);
   const rawTeachers = useSelector(rawTeachersSelector);

   const [search, setSearch] = useState(""); // фильтр по имени и фамилии...
   const [searchInstitutes, setSearchInstitutes] = useState<Set<string>>(new Set()); // фильтр по институту...

   const [filtered, setFiltered] = useState<FBTeacher[]>([]);

   const [loading, setLoading] = useState(false);

   const loadTeachers = useCallback(async () => {
      const q = QUERIES.CREATE_SIMPLE_QUERY<FBAppUser>(DB_PATHS.USERS, {
         fieldName: "type",
         fieldValue: USER_TYPE.TEACHER,
         opStr: "==",
      });
      setLoading(true);
      const data = await getAllDataWithFilter<FBTeacher>(q);
      // сетаем сырые данные в slice
      dispatch(setSearchData(data));
      // сетаем готовые данные конечный результат
      setFiltered(data);

      setLoading(false);
   }, [dispatch]);

   // делаем проверку на фильтры и сразу вызываем их

   const inputFilter = useCallback(
      (teacher: FBTeacher) =>
         teacher.name.toLowerCase().includes(search.toLowerCase()) || // ищем совпадение в имени
         teacher.female.toLowerCase().includes(search.toLowerCase()), // ищем совпадение в фамилии
      [search],
   );

   const institutesFilter = useCallback(
      (teacher: FBTeacher) => teacher.institutes_ids.some((instituteId) => searchInstitutes.has(instituteId)),
      [searchInstitutes],
   );

   const filterTeachers = useCallback(() => {
      const isInputFilterEnabled = search.length > 0;

      const isInstitutesFilterEnabled = searchInstitutes.size > 0;

      setFiltered(
         rawTeachers.filter((teacher) => {
            if (isInputFilterEnabled && !isInstitutesFilterEnabled) {
               return inputFilter(teacher);
            }
            if (!isInputFilterEnabled && isInstitutesFilterEnabled) {
               return institutesFilter(teacher);
            }
            if (isInputFilterEnabled && isInstitutesFilterEnabled) {
               return inputFilter(teacher) && institutesFilter(teacher);
            }
            return teacher;
         }),
      );
   }, [inputFilter, institutesFilter, rawTeachers, search.length, searchInstitutes]);

   // const dFilterTeacher = debounce(filterTeachers, 250);

   const onChangeInstituteHandler = useCallback((institute: string) => {
      setSearchInstitutes((prev) => {
         if (prev.has(institute)) {
            return new Set([...prev].filter((item) => item !== institute));
         }

         return new Set([...prev, institute]);
      });
   }, []);

   // делаем полную загрузку всех преподавателей при первом заходе...
   useEffect(() => {
      // проверка на наличие
      if (isEmpty(rawTeachers)) {
         loadTeachers();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // при изменении какого-либо фильтра, делаем новую фильтрацию
   useEffect(() => {
      filterTeachers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [search, searchInstitutes]);

   return useMemo(() => {
      return {
         search,
         loading,
         searchInstitutes,
         teachers: filtered.map((teacher) => UserConverter.toData(teacher)) as Teacher[],
         onChange: setSearch,
         onInstitutesChange: onChangeInstituteHandler,
      };
   }, [filtered, loading, setSearch, onChangeInstituteHandler, search, searchInstitutes]);
}
