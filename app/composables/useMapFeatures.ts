import { computed } from "vue";
import { transform } from "ol/proj";
import type { Coordinate } from "ol/coordinate";
import type { Issue } from "~/types/Issue";

export function useMapFeatures(issues: Issue[] | null) {
  const markers = computed(() => {
    return (
      issues?.filter(
        (issue): issue is Issue => issue.geometry?.type === "Point"
      ) ?? []
    );
  });

  const polygons = computed(() => {
    return (
      issues?.filter(
        (issue): issue is Issue => issue.geometry?.type === "Polygon"
      ) ?? []
    );
  });

  const lines = computed(() => {
    return (
      issues?.filter(
        (issue): issue is Issue => issue.geometry?.type === "LineString"
      ) ?? []
    );
  });

  function toPointCoords(issue: Issue): Coordinate {
    if (issue.geometry.type !== "Point") return [0, 0];
    return transform(issue.geometry.coordinates, "EPSG:4326", "EPSG:3857");
  }

  function toLineCoords(issue: Issue): Coordinate[] {
    if (issue.geometry.type !== "LineString") return [[0, 0]];
    return issue.geometry.coordinates.map((coord) =>
      transform(coord, "EPSG:4326", "EPSG:3857")
    );
  }

  function toPolygonCoords(issue: Issue): Coordinate[][] {
    if (issue.geometry.type !== "Polygon") return [[[0, 0]]];
    return issue.geometry.coordinates.map((ring) =>
      ring.map((coord) => transform(coord, "EPSG:4326", "EPSG:3857"))
    );
  }

  return {
    markers,
    polygons,
    lines,
    toPointCoords,
    toLineCoords,
    toPolygonCoords,
  };
}
