import type { Ref } from "vue";

export function useNavigationDrawer() {
  const isOpen = useState<boolean>("navigation-drawer-open", () => false);
  const { smAndUp } = useDisplay();

  // On desktop, drawer is always open
  watch(
    smAndUp,
    (isDesktop) => {
      if (isDesktop) {
        isOpen.value = true;
      }
    },
    { immediate: true }
  );

  function open() {
    isOpen.value = true;
  }

  function close() {
    if (!smAndUp.value) {
      isOpen.value = false;
    }
  }

  watch(
    isOpen,
    () => console.log("Navigation drawer state changed:", isOpen.value),
    { immediate: true }
  );

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  return {
    isOpen: isOpen as Ref<boolean>,
    open,
    close,
    toggle,
  };
}
