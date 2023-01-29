import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { getMaterialById } from "../../api";
import { DBQueries } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";
export const useMaterials = (disciplineId: string) => {
  const q = QUERIES.CREATE_SIMPLE_QUERY_ORDERED<Material>(
    DBQueries.MATERIALS,
    {
      fieldName: "disciplineId",
      fieldValue: disciplineId,
      opStr: "==",
    },
    {
      fieldValue: "timestamp",
    }
  );
  const [snapshot, loading, error] = useCollection(q);
  const [materials, setMaterials] = useState<Material[]>(null);

  const rawMaterials = snapshot?.docs.map(
    (m) =>
      ({
        id: m.id,
        ...m.data(),
      } as Material)
  );

  useEffect(() => {
    const getData = async () => {
      await Promise.all(
        snapshot?.docs.map(async (doc) => {
          const m = await getMaterialById(doc.id);
          return m;
        }) || []
      )
        .then((data) => {
          setMaterials(data || []);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getData();
  }, [snapshot]);

  return { materials: materials?.length ? materials : rawMaterials, loading, error };
};
