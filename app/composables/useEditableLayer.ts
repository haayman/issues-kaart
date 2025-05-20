import {
  type Map,
  Polygon as LeafletPolygon,
  Polyline as LeafletPolyline,
  DomEvent,
  Marker,
} from "leaflet";
import type { Feature, LineString, Point, Polygon } from "geojson";
import type { ShallowRef } from "vue";

export const useEditableLayer = (
  layer: ShallowRef<LeafletPolygon | LeafletPolyline | Marker | undefined>,
  id: number
) => {
  const feature: Ref<Feature<Polygon | LineString | Point> | null> = ref(null);
  const editableRef = ref(false);

  const mapPromise = useMap().injectMap();
  let map: Map | undefined = undefined;
  onMounted(async () => {
    map = await mapPromise;
  });

  function onChangeFeatureLayer() {
    feature.value = layer.value?.toGeoJSON() as Feature<
      Polygon | LineString | Point
    >;
  }

  function toggleEdit() {
    editableRef.value = !editableRef.value;
    layer.value?.toggleEdit();
  }

  function addHandlers(layer: LeafletPolygon | LeafletPolyline | Marker) {
    map?.on("editable:drawing:commit", onChangeFeatureLayer);
    layer.on("editable:vertex:dragend", onChangeFeatureLayer);
    layer.on("editable:vertex:deleted", onChangeFeatureLayer);

    layer
      .on("dblclick", DomEvent.stop)
      .on("click", DomEvent.stop)
      .on("dblclick", toggleEdit);
  }

  function removeHandlers(layer: LeafletPolygon | LeafletPolyline | Marker) {
    map?.off("editable:drawing:commit", onChangeFeatureLayer);
    layer.off("editable:vertex:dragend", onChangeFeatureLayer);
    layer.off("editable:vertex:deleted", onChangeFeatureLayer);
    layer.off("editable:enable");
    layer.off("editable:disable");
    layer.off("dblclick", toggleEdit);
  }

  watch([layer, editableRef], () => {
    if (!layer.value) return;
    const rawLayer = toRaw(layer.value);
    // @ts-ignore
    if (!rawLayer.editor) {
      if (rawLayer instanceof Marker) {
        // @ts-ignore
        rawLayer.editor = new L.Editable.MarkerEditor(map, rawLayer);
      } else if (rawLayer instanceof LeafletPolygon) {
        // @ts-ignore
        rawLayer.editor = new L.Editable.PolygonEditor(map, rawLayer);
      } else if (rawLayer instanceof LeafletPolyline) {
        // @ts-ignore
        rawLayer.editor = new L.Editable.PolylineEditor(map, rawLayer);
      }
    }
    console.log("set rawLayer editible", id, editableRef.value);
    if (editableRef.value) {
      addHandlers(rawLayer);
      rawLayer.enableEdit();
    } else {
      rawLayer.disableEdit();
      removeHandlers(rawLayer);
    }
  });

  return {
    feature,
    editableRef,
  };
};
