import {
  type Polygon as LeafletPolygon,
  type Polyline as LeafletPolyline,
  type Marker,
  type Map,
  DomEvent,
} from "leaflet";
import type { Feature, LineString, Point, Polygon } from "geojson";

export const useEditableLayer = (id: number) => {
  const feature: Ref<Feature<Polygon | LineString | Point> | null> = ref(null);
  const editableRef = ref(false);

  const mapPromise = useMap().injectMap();
  let map: Map | undefined = undefined;

  let layer: LeafletPolygon | LeafletPolyline | Marker | undefined;

  onMounted(async () => {
    map = await mapPromise;
  });

  function onChangeFeatureLayer() {
    feature.value = layer?.toGeoJSON() as Feature<Polygon | LineString | Point>;
  }

  function toggleEdit() {
    editableRef.value = !editableRef.value;
    layer?.toggleEdit();
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

  watch(editableRef, () => {
    if (!layer) {
      console.warn("Layer not set");
      return;
    }
    // @ts-ignore
    console.log("set layer editible", id, editableRef.value);
    try {
      if (editableRef.value) {
        addHandlers(layer);
        layer.enableEdit();
      } else {
        layer.disableEdit();
        removeHandlers(layer);
      }
    } catch (e) {
      console.error("Error setting layer editable", e);
    }
  });

  function addEditor(newLayer: LeafletPolygon | LeafletPolyline | Marker) {
    layer = newLayer;
    // if (!layer.editor) {
    //   if (layer instanceof Marker) {
    //     // @ts-ignore
    //     layer.editor = new L.Editable.MarkerEditor(map, layer);
    //   } else if (layer instanceof LeafletPolygon) {
    //     // @ts-ignore
    //     layer.editor = new L.Editable.PolygonEditor(map, layer);
    //   } else if (layer instanceof LeafletPolyline) {
    //     // @ts-ignore
    //     layer.editor = new L.Editable.PolylineEditor(map, layer);
    //   }
    // }
  }

  return {
    feature,
    editableRef,
    addEditor,
  };
};
