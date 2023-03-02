import React, { useMemo } from "react";

import { FlatList, Text, View } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Error, Loader, MaterialCard } from "../components";
import { selectUser } from "../features/userSlice";
import { useFavorites } from "../hooks";
import type { Material } from "../typings";
import { isEmpty, returnHexCode } from "../utils";

export function FavoritesScreen() {
   const tw = useTailwind();
   const user = useSelector(selectUser);

   // const [filter, setFilter] = useState<string>("All");

   const { favorites: favoritesList, loading } = useFavorites();

   const favorites = useMemo(
      () =>
         favoritesList.reduce((total, item) => {
            // eslint-disable-next-line no-param-reassign
            (total[item.disciplineName] = total[item.disciplineName] || []).push(item.material);

            return total;
         }, {} as Record<string, Material[]>),
      [favoritesList],
   );

   if (loading) {
      return <Loader text="Загрузка избранных материалов" theme={user?.theme} />;
   }
   if (isEmpty(favorites)) {
      return <Error text="У вас нет избранных материалов" theme={user?.theme} />;
   }

   return (
      <View style={tw("py-6 flex flex-col")}>
         {/* Favorites filter */}
         {/* <View style={tw("flex flex-row px-4 py-4 flex-wrap")}>
        {["All", ...disciplines].map((discipline) => (
          <TouchableOpacity
            key={discipline}
            onPress={() => setFilter(discipline)}
            style={[
              tw("rounded-lg px-3 py-1"),
              {
                backgroundColor: returnHexCode(user?.theme || 'blue'),
              },
            ]}
          >
            <Text style={tw("text-white")}>{discipline}</Text>
          </TouchableOpacity>
        ))}
      </View> */}
         {/* List of all favorites */}
         <FlatList
            data={Object.keys(favorites)}
            showsVerticalScrollIndicator={false}
            scrollEnabled
            renderItem={({ item: title }) => (
               <View key={title}>
                  <Text
                     style={[
                        tw("text-center text-lg px-4 py-2 mt-4 font-extrabold"),
                        {
                           backgroundColor: returnHexCode(user.theme),
                        },
                     ]}
                  >
                     {title}
                  </Text>
                  <FlatList
                     style={tw("px-2")}
                     data={favorites[title]}
                     showsVerticalScrollIndicator={false}
                     scrollEnabled
                     renderItem={(favorite) => (
                        <MaterialCard
                           key={favorite.index}
                           material={favorite.item}
                           userId={user.id}
                           userTheme={user.theme}
                           userType={user.type}
                        />
                     )}
                  />
               </View>
            )}
         />
      </View>
   );
}
