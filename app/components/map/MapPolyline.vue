<template>
  <LPolyline
    :lat-lngs="latLngs"
    :options="lineOptions"
    :weight="5"
    @ready="onReady"
    @click="$emit('click')"
  >
    <LTooltip :sticky="true">
      <slot name="tooltip" />
    </LTooltip>
  </LPolyline>
</template>

<script setup lang="ts">
import type { Polyline } from "leaflet";
import { onUnmounted, watch } from "vue";

const props = defineProps<{
  id: number;
  latLngs: [number, number][];
  color: string;
  selected?: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();

const lineOptions = {
  color: props.color,
  weight: 3,
  opacity: 1,
};

let svgPath: SVGPathElement | null = null;

function setupSvgElement(line: Polyline) {
  const path = line.getElement();
  if (path instanceof SVGPathElement) {
    svgPath = path;
    updateClass();
  }
}

function updateClass() {
  if (!svgPath) return;

  if (props.selected) {
    svgPath.classList.add("line-selected");
  } else {
    svgPath.classList.remove("line-selected");
  }
}

const layer = shallowRef<Polyline | undefined>();
function onReady(line: Polyline) {
  setupSvgElement(line);
  layer.value = line;
}

const { editable } = useEditableLayer(layer, props.id);

const eventBus = useMapEventBus().inject();
if (!eventBus) throw new Error("No eventBus provided yet");
onMounted(() => {
  eventBus.on("toggleEditable", (id: number) => {
    if (id === props.id) {
      editable.value = !editable.value;
    }
  });
});
onUnmounted(() => {
  eventBus.off("toggleEditable");
});

watch(() => props.selected, updateClass);
</script>

<style>
.line-selected {
  filter: drop-shadow(0 0 8px currentColor)
    drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
}

path {
  transition: all 0.3s ease;
}

path:hover:not(.line-selected) {
  filter: brightness(1.2);
}
</style>
