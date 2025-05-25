import type { Ref } from "vue";

export function useNavigationDrawer() {
  const isOpen = useState<boolean>("navigation-drawer-open", () => false);
  const { mobile } = useDisplay();

  // On desktop, drawer is always open
  watch(
    mobile,
    (mobile) => {
      if (!mobile) {
        isOpen.value = true;
      }
    },
    { immediate: true }
  );

  function open() {
    isOpen.value = true;
  }

  function close() {
    if (mobile.value) {
      isOpen.value = false;
    }
  }

  watch(isOpen, () => console.log("isOpen", isOpen.value), { immediate: true });

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
