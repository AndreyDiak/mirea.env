import React, { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";

import { SimpleModal } from "./modals/SimpleModal";

export const enum MODAL_TYPES {
   SIMPLE_MODAL = "simple_modal",
}

const MODAL_COMPONENTS: Record<MODAL_TYPES, () => JSX.Element> = {
   simple_modal: SimpleModal,
};

interface ModalPropsChildren {
   title: string;
   children: () => JSX.Element;
}

interface GlobalModalContextStore {
   modalType: MODAL_TYPES;
   modalProps: ModalPropsChildren;
}

interface GlobalModalContext {
   openModal: (modalType: MODAL_TYPES, modalProps: ModalPropsChildren) => void;
   closeModal: () => void;
   store: GlobalModalContextStore;
}

const modalContext: GlobalModalContext = {
   openModal: () => null,
   closeModal: () => null,
   store: null,
};

const GlobalModalContext = createContext(modalContext);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal: React.FC<{ children: ReactNode }> = React.memo(({ children }) => {
   const [store, setStore] = useState<GlobalModalContextStore>(null);

   const { modalType: type, modalProps: props } = store ?? {};

   const openModal = useCallback(
      (modalType: MODAL_TYPES, modalProps: ModalPropsChildren) => {
         setStore({
            ...store,
            modalType,
            modalProps,
         });
      },
      [store],
   );

   const closeModal = useCallback(() => {
      setStore({
         ...store,
         modalType: null,
         modalProps: null,
      });
   }, [store]);

   const ProviderValue = useMemo(
      () => ({
         store,
         openModal,
         closeModal,
      }),
      [closeModal, openModal, store],
   );

   const render = () => {
      const ModalComponent = MODAL_COMPONENTS[type];
      if (!type || !props) {
         return null;
      }
      return <ModalComponent />;
   };

   return (
      <GlobalModalContext.Provider value={ProviderValue}>
         {render()}
         {children}
      </GlobalModalContext.Provider>
   );
});
