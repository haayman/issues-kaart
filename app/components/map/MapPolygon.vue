<template>
  <LPolygon
    :lat-lngs="latLngs"
    :options="polygonOptions"
    @ready="onReady"
    @click="$emit('click')"
  >
    <LTooltip :sticky="true">
      <slot name="tooltip" />
    </LTooltip>
  </LPolygon>
</template>

<script setup lang="ts">
import type { Polygon } from "leaflet";
import { watch } from "vue";

const props = defineProps<{
  id: number;
  latLngs: [number, number][];
  color: string;
  selected?: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();

const polygonOptions = {
  color: props.color,
  weight: 2,
  opacity: 1,
  fillOpacity: 0.3,
};

let svgPath: SVGPathElement | null = null;

function setupSvgElement(polygon: Polygon) {
  const path = polygon.getElement();
  if (path instanceof SVGPathElement) {
    svgPath = path;
    updateClass();
  }
}

function updateClass() {
  if (!svgPath) return;

  if (props.selected) {
    svgPath.classList.add("polygon-selected");
  } else {
    svgPath.classList.remove("polygon-selected");
  }
}

const { editableRef, addEditor } = useEditableLayer(props.id);

function onReady(polygon: Polygon) {
  setupSvgElement(polygon);
  addEditor(polygon);
}

const eventBus = useMapEventBus().inject();
if (!eventBus) throw new Error("No eventBus provided yet");
onMounted(() => {
  eventBus.on("setEditable", ({ id, editable }) => {
    if (id === props.id) {
      editableRef.value = editable;
    }
  });
});
onUnmounted(() => {
  eventBus.off("setEditable");
});
watch(() => props.selected, updateClass, { immediate: true });
</script>

<style>
.polygon-selected {
  filter: drop-shadow(0 0 8px currentColor)
    drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
}

path {
  transition: all 0.3s ease;
}

path:hover:not(.polygon-selected) {
  filter: brightness(1.2);
}
</style>
