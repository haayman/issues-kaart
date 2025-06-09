<template>
  <ol-map ref="mapRef">
    <ol-view
      ref="view"
      :center="center"
      :zoom="zoom"
      :projection="projection"
    />

    <MapSearch @selected="(bbox) => onSearchSelected(view, bbox)" />
    <MapAddFeature ref="addFeature" />

    <ol-layerswitcherimage-control :mouseover="true" />
    <OlCustomControl position="bottom-left">
      <SizeCalculator v-model="legendSize">
        <MobileCollapsible title="Legenda" icon="mdi-map-legend">
          <MapLegend />
        </MobileCollapsible>
      </SizeCalculator>
    </OlCustomControl>

    <MapLayers>
      <MapFeatures :issues="issues" />
    </MapLayers>

    <ol-interaction-select
      v-if="!isDrawing"
      :condition="click"
      :style="getSelectionStyle"
      @select="onFeatureSelect"
    />
  </ol-map>
</template>

<script setup lang="ts">
import type { Feature } from "ol";
import type { SelectEvent } from "ol/interaction/Select";
import { click } from "ol/events/condition";
import type { Point, LineString, Polygon } from "ol/geom";
import type { Issue } from "~/types/Issue";

interface Size {
  width: number;
  height: number;
}

const { center, zoom, projection, onSearchSelected } = useMapViewConfig();

const { issues } = storeToRefs(useIssues());
const { selectedId } = storeToRefs(useSelectedIssue());

// Local state
const legendSize = ref<Size>({ width: 0, height: 0 });
const view = useTemplateRef("view");
const addFeature = ref(null);

// Import the useMapStyles composable
const { getSelectionStyle } = useMapStyles();

// Computed properties
const isDrawing = computed(() => {
  // @ts-expect-error - isDrawing is a property of the addFeature component
  return addFeature.value?.isDrawing || false;
});

// Event handlers
function navigateToIssue(issue: Issue) {
  navigateTo(`/kaart/${issue.id}`);
}

function onFeatureSelect(event: SelectEvent) {
  const selected = event.selected;
  if (selected && selected.length > 0) {
    const feature = selected[0] as Feature<Point | LineString | Polygon>;
    const properties = feature.getProperties();
    const issueId = properties.issueId;
    if (issueId !== selectedId.value) {
      selectedId.value = issueId;
      navigateToIssue({ id: issueId } as Issue);
      emit("feature-clicked");
    }
  }
}

const emit = defineEmits(["feature-clicked"]);
</script>

<style>
/* Optional styles */
</style>
