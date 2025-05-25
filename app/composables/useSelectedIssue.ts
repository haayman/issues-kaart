import { computed } from "vue";

export function useSelectedIssue() {
  const route = useRoute();

  const selectedIssueId = computed(() => {
    const { id } = route.params;
    if (!id || id === "index") return undefined;
    if (id === "new") return undefined;
    return parseInt(id as string);
  });

  return {
    selectedIssueId,
  };
}
