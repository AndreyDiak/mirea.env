import { Icon } from "@rneui/themed";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import Material from "../components/discipline/Material";
import { getUser } from "../features/userSlice";
import { db } from "../firebase";
import { returnHexCode } from "../utils/returnHexCodes";

type Props = {};



const FavoritesScreen = (props: Props) => {
  const tw = useTailwind();
  // const notifications = useSelector(getNotifications);
  const user = useSelector(getUser);
  const [favorites, setFavorites] = useState<Favorites[]>([]);
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All')

  const q = query(collection(db, `users/${user?.userId}/favorites`));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    interface newFavorites {
      materialId: string;
      favoriteId: string;
    }
    const newFavorites: newFavorites[] = snapshot.docs.map(
      (favorite) =>
      ({
        ...favorite.data(),
        favoriteId: favorite.id,
      } as newFavorites)
    );

    let data: Favorites[] = [];
    let newDisciplines: string[] = [];
    await Promise.all(
      newFavorites.map(async (favorite) => {
        const q = doc(db, "materials", `${favorite.materialId}`);
        const snap = await getDoc(q);

        if (snap.exists()) {
          // getting discipline title...
          const disciplineQ = doc(
            db,
            "disciplines",
            `${snap.data().disciplineId}`
          );
          const disciplineSnap = await getDoc(disciplineQ);
          let disciplineTitle = "";
          if (disciplineSnap.exists()) {
            disciplineTitle = disciplineSnap.data().title;
            if (!newDisciplines.includes(disciplineTitle)) {
              newDisciplines.push(disciplineTitle);
            }
          }
          // getting material documents...
          const docQ = query(
            collection(db, `material/${favorite.materialId}/sources`)
          );
          const docSnap = await getDocs(docQ);
          // getting material comments...
          const commentsQuery = query(
            collection(db, "comments"),
            where("materialId", "==", favorite.materialId),
            orderBy("timestamp")
          );
          const commentSnap = await getDocs(commentsQuery);

          data.push({
            disciplineTitle: disciplineTitle,
            material: {
              ...snap.data(),
              documents: docSnap.docs.map(
                (doc) =>
                ({
                  ...doc.data(),
                  documentId: doc.id,
                } as Document)
              ),
              comments: commentSnap.docs.map(
                (comment) =>
                ({
                  ...comment.data(),
                  commentId: comment.id,
                } as Comment)
              ),
              materialId: favorite.materialId,
            } as Material,
          });
        }
      })
    );

    if (data.length !== favorites.length) setFavorites(data);
    if (disciplines.length !== newDisciplines.length)
      setDisciplines(newDisciplines);
  });

  return (
    <View style={tw("py-6")}>
      {favorites?.length ? (
        // Добавить фильтр по дисциплинам?
        <View>
          {/* Favorites filter */}
          <View style={tw('flex flex-row px-4 py-4')}>
            {['All', ...disciplines].map(discipline => (
              <TouchableOpacity
                onPress={() => setActiveFilter(discipline)}
                style={[tw('rounded-lg px-3 text-white py-1'), {
                  backgroundColor: returnHexCode(user.theme)
                }]}>
                <Text>{discipline}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* List of all favorites */}
          <FlatList
            data={disciplines
              .filter((discipline) => activeFilter === 'All' ? discipline : discipline === activeFilter)
              .sort((prev, next) => prev.localeCompare(next))}
            showsVerticalScrollIndicator={false}
            renderItem={(discipline) => (
              <View>
                {/* discipline title */}
                <Text style={[tw('text-center text-lg px-4 py-2 mt-4 font-extrabold'), {
                  // color: returnHexCode(user?.theme as AppTheme),
                  backgroundColor: returnHexCode(user?.theme as AppTheme)
                }]}>{discipline.item}</Text>

                <FlatList
                  style={tw('px-2')}
                  data={favorites.filter(
                    (favorite) => favorite.disciplineTitle === discipline.item
                  )}
                  showsVerticalScrollIndicator={false}
                  renderItem={(favorite) => (
                    <Material
                      material={favorite.item.material}
                      userId={user?.userId}
                      userTheme={user?.theme}
                      userType={user?.type}
                    />
                  )}
                />
              </View>
            )}
          />
        </View>
      ) : (
        <View style={tw("h-full w-full flex justify-center items-center")}>
          <View>
            <Text style={tw("text-center mt-4 mb-2 text-xl")}>
              У вас нет избранных материалов
            </Text>
            <Icon
              name="sentiment-very-dissatisfied"
              type="material"
              color={returnHexCode(user?.theme as AppTheme)}
              size={30}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default FavoritesScreen;
