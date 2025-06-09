<template>
  <ol-source-vector>
    <!-- Point features -->
    <ol-feature
      v-for="issue in markers"
      :key="`marker-${issue.id}`"
      :properties="{ issueId: issue.id }"
    >
      <ol-geom-point :coordinates="toPointCoords(issue)" />
      <ol-style :get-style="() => getStyle(issue, 'Point')" />
    </ol-feature>

    <!-- Line features -->
    <ol-feature
      v-for="issue in lines"
      :key="`line-${issue.id}`"
      :properties="{ issueId: issue.id }"
    >
      <ol-geom-line-string :coordinates="toLineCoords(issue)" />
      <ol-style :get-style="() => getStyle(issue, 'LineString')" />
    </ol-feature>

    <!-- Polygon features -->
    <ol-feature
      v-for="issue in polygons"
      :key="`polygon-${issue.id}`"
      :properties="{ issueId: issue.id }"
    >
      <ol-geom-polygon :coordinates="toPolygonCoords(issue)" />
      <ol-style :get-style="() => getStyle(issue, 'Polygon')" />
    </ol-feature>

    <!-- editor -->
    <ol-interaction-modify
      v-if="modifyEnabled"
      :features="selectedFeatures"
      @modifyend="onModifyEnd"
    />
  </ol-source-vector>
</template>

<script setup lang="ts">
import type { Issue } from "~/types/Issue";
import type { ModifyEvent } from "ol/interaction/Modify";
import { GeoJSON } from "ol/format";
import { Collection } from "ol";
import type { Feature } from "ol";
import type { Point, LineString, Polygon } from "ol/geom";
import { useMapFeatures } from "~/composables/useMapFeatures";
import { useMapStyles } from "~/composables/useMapStyles";

const props = defineProps<{
  issues: Issue[] | null;
}>();

const { issue: selectedIssue } = storeToRefs(useSelectedIssue());
const { isEditing } = useIsEditing();

const {
  markers,
  polygons,
  lines,
  toPointCoords,
  toLineCoords,
  toPolygonCoords,
} = useMapFeatures(props.issues);
const { getStyle } = useMapStyles();

const selectedFeatures = ref<Collection<Feature<Point | LineString | Polygon>>>(
  new Collection()
);

const modifyEnabled = computed(() => {
  return isEditing.value && selectedIssue.value;
});

function onModifyEnd(event: ModifyEvent) {
  const writer = new GeoJSON();
  const feature = event.features.item(0);
  if (!feature) {
    console.warn("No feature modified");
    return;
  }
  const geoJSON = writer.writeFeatureObject(feature, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });
  // @ts-expect-error - we know this is valid
  selectedIssue.value!.geometry = geoJSON.geometry;
}
</script>
