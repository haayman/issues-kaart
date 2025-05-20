import { inject, provide } from "vue";
// https://github.com/developit/mitt
import mitt, { type Emitter } from "mitt";
import type { FitBoundsOptions } from "leaflet";
import type { Point, Polygon, LineString } from "geojson";

export type MapEvents = {
  zoomLevel: number;
  zoomToFeature: {
    noZoom?: boolean;
  } & FitBoundsOptions;

  clearFeature: undefined;
  startPoint: undefined;
  startPolygon: undefined;
  startLine: undefined;
  toggleEditable: number;
  setEditable: {
    id: number;
    editable: boolean;
  };
  geometryUpdated: {
    id: number;
    geometry: Point | Polygon | LineString;
  };
};
/**
 * @example 
 * 
 * onMounted(async () => {
 *   map = await useMap().injectMap();
 * });

 */
export function useMapEventBus() {
  const provideKey = "map-eventbus";

  function provideEventBus() {
    const eventBus = mitt<MapEvents>();
    provide(provideKey, eventBus);

    eventBus.on("*", (...args) => {
      console.log("eventbus", args);
    });

    return eventBus;
  }

  // request map, map is not required
  function injectMapEventBus() {
    return inject<Emitter<MapEvents>>(provideKey);
  }

  return { provide: provideEventBus, inject: injectMapEventBus };
}
