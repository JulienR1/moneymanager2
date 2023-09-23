import {
  Component,
  Index,
  JSX,
  ValidComponent,
  createContext,
  createSignal,
  useContext,
} from "solid-js";
import { Dynamic, Portal } from "solid-js/web";

type IModalContext = (component: ValidComponent) => (modalId: number) => void;

const ModalContext = createContext<IModalContext>(
  (_: ValidComponent) => (_: number) => ({}),
);

type ModalProviderProps = {
  children: JSX.Element;
};

let modalId = 0;
const modalContainer = document.getElementById("modals")!;

const ModalProvider: Component<ModalProviderProps> = (props) => {
  const [modals, setModals] = createSignal<
    Array<{ id: number; component: ValidComponent }>
  >([]);

  function registerModal(component: ValidComponent) {
    const id = modalId++;
    setModals((previousModals) => [...previousModals, { id, component }]);
    return () => removeModal(id);
  }

  function removeModal(id: number) {
    setModals((previousModals) => previousModals.filter((m) => m.id !== id));
  }

  return (
    <ModalContext.Provider value={registerModal}>
      {props.children}

      <Portal mount={modalContainer}>
        <div class="pointer-events-none fixed top-0 h-[100vh] w-[100vw]">
          <Index each={modals()}>
            {(modal) => <Dynamic component={modal().component} />}
          </Index>
        </div>
      </Portal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
export default ModalProvider;
