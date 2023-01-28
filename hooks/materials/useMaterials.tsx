import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { getMaterialById } from "../../api";
import { db } from "../../firebase";

export const useMaterials = (disciplineId: string) => {
  const [initialMaterials, setInitialMaterials] = useState<Material[]>([]);
  const q = query(
    collection(db, "materials"),
    where("disciplineId", "==", disciplineId),
    orderBy("timestamp")
  );

  onSnapshot(q, async (snapshot) => {
    const materials = await Promise.all(
      snapshot.docs.map(async (m) => {
        const material = await getMaterialById(m.id);
        return material;
      })
    );

    if (materials.length !== initialMaterials.length) {
      setInitialMaterials(materials);
    }
  });

  return { initialMaterials };
};
