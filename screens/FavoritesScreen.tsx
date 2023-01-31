import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Error, Loader, Material } from "../components";
import { getUser } from "../features/userSlice";
import { useFavorites } from "../hooks";
import { returnHexCode } from "../utils/returnHexCodes";

export const FavoritesScreen = () => {
  const tw = useTailwind();
  const user = useSelector(getUser);

  const [filter, setFilter] = useState<string>("All");

  const { favorites: favoritesList, loading, error } = useFavorites();
  // нужно скомпановать материалы по дисциплинам

  const favorites = useMemo(
    () =>
      favoritesList.reduce((total, item) => {
        (total[item.disciplineName] = total[item.disciplineName] || []).push(item.material);

        return total;
      }, {} as Record<string, Material[]>),
    [favoritesList]
  );

  if (loading) {
    return <Loader text={"Загрузка избранных материалов"} theme={user?.theme} />;
  }
  if (!favorites) {
    return <Error text={"У вас нет избранных материалов"} theme={user?.theme} />;
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
        renderItem={({ item: title, index }) => (
          <View key={title}>
            <Text
              style={[
                tw("text-center text-lg px-4 py-2 mt-4 font-extrabold"),
                {
                  backgroundColor: returnHexCode(user?.theme as AppTheme),
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
                <Material
                  key={favorite.index}
                  material={favorite.item}
                  userId={user.userId}
                  userTheme={user?.theme}
                  userType={user.type}
                />
              )}
            />
          </View>
        )}
      />
    </View>
  );
};
