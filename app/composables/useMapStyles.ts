import { Style, Circle, Fill, Stroke } from "ol/style";
import type { Issue } from "~/types/Issue";
import { storeToRefs } from "pinia";
import { useSelectedIssue } from "~/composables/useSelectedIssue";
import type { Feature } from "ol";
import type { Geometry } from "ol/geom";

export function useMapStyles() {
  const { selectedId } = storeToRefs(useSelectedIssue());

  function isSelected(issue: Issue) {
    return issue.id === selectedId.value;
  }

  function getPolygonFillColor(issue: Issue) {
    const color = issue.color || "#000000";
    return color + "40"; // 40 is 25% opacity in hex
  }

  function getStyle(issue: Issue, geometryType: string) {
    if (!issue) return;

    switch (geometryType) {
      case "Point":
        return new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: issue.color }),
            stroke: new Stroke({
              color: isSelected(issue) ? "black" : "white",
              width: 2,
            }),
          }),
        });

      case "LineString":
        return new Style({
          stroke: new Stroke({
            color: issue.color,
            width: isSelected(issue) ? 6 : 3,
          }),
        });

      case "Polygon":
        return new Style({
          stroke: new Stroke({
            color: isSelected(issue) ? "black" : issue.color,
            width: 2,
          }),
          fill: new Fill({
            color: getPolygonFillColor(issue),
          }),
        });

      default:
        return undefined;
    }
  }

  function getSelectionStyle(feature: Feature<Geometry>) {
    const geometry = feature.getGeometry();
    if (!geometry) return;

    switch (geometry.getType()) {
      case "Point":
        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: "rgba(0,0,255,0.4)" }),
            stroke: new Stroke({ color: "blue", width: 3 }),
          }),
        });

      case "LineString":
        return new Style({
          stroke: new Stroke({
            color: "blue",
            width: 6,
          }),
        });

      case "Polygon":
        return new Style({
          stroke: new Stroke({ color: "blue", width: 3 }),
          fill: new Fill({ color: "rgba(0,0,255,0.3)" }),
        });
    }
  }

  return {
    getStyle,
    getSelectionStyle,
  };
}
