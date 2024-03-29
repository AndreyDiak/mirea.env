import React, { useMemo } from "react";

import { FlatList, Text, View } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { FullScreenError, Loader, MaterialCard, ScreenTemplate } from "../components";
import { useFavorites } from "../features/hooks";
import { selectUser } from "../features/slices/userSlice";
import { useTheme } from "../hooks";
import type { Material } from "../typings";
import { isEmpty } from "../utils";

export function FavoritesScreen() {
   const tw = useTailwind();
   const user = useSelector(selectUser);

   // const [filter, setFilter] = useState<string>("All");

   const { THEME_MAIN } = useTheme();

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
      return <FullScreenError text="У вас нет избранных материалов" theme={user?.theme} />;
   }

   return (
      <ScreenTemplate style={tw("py-6")}>
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
                           backgroundColor: THEME_MAIN,
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
                           userType={user.type}
                        />
                     )}
                  />
               </View>
            )}
         />
      </ScreenTemplate>
      // </View>
   );
}
