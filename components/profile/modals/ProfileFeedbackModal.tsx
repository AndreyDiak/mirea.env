import React, { useState } from "react";

import { Input } from "@rneui/themed";
import { addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserId } from "../../../features/userSlice";
import { DB_PATHS } from "../../../typings/enums";
import { createCollection } from "../../../utils";
import { Button } from "../../Button";

export function ProfileFeedbackModal() {
   const tw = useTailwind();

   const userId = useSelector(selectUserId);
   const [feedbackText, setFeedbackText] = useState("");

   const sendFeedback = async () => {
      await addDoc(createCollection(DB_PATHS.REVIEWS), {
         userId,
         text: "",
      });
   };

   return (
      <>
         <Input value={feedbackText} onChangeText={setFeedbackText} placeholder="Введите текст" />
         <Button title="Отправить отзыв" callback={sendFeedback} />
      </>
   );
}
