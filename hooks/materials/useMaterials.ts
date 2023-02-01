import { useCollection } from "react-firebase-hooks/firestore";
import type { Material } from "../../typings";
import { DBQueries } from "../../typings/enums";
import { QUERIES } from "../../utils";

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

  const materials = snapshot?.docs.map(
    (m) =>
      ({
        id: m.id,
        ...m.data(),
      } as Material)
  );

  return { materials, loading, error };
};
