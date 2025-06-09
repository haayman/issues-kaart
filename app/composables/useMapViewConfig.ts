import { ref, watch } from "vue";
import { register } from "ol/proj/proj4.js";
import proj4 from "proj4";
import Projection from "ol/proj/Projection";
import type { BBox } from "geojson";
import type { FitOptions } from "ol/View";
import { easeOut } from "ol/easing";

export function useMapViewConfig() {
  // Initialize RD projection (Dutch coordinate system)
  proj4.defs(
    "EPSG:28992",
    "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"
  );
  register(proj4);

  const rdProjection = new Projection({
    code: "EPSG:28992",
    extent: [-285401.92, 22598.08, 595401.92, 903401.92],
  });

  const center = ref([687858.9021986299, 6846820.48790154]);
  const zoom = ref(13);
  const projection = ref("EPSG:3857");

  const defaultPadding = [50, 50, 50, 50]; // [top, right, bottom, left]
  const currentPadding = ref(defaultPadding);

  function setBbox(view: any, bbox: BBox, options: FitOptions = {}) {
    if (!view) return;
    const padding = options.padding || currentPadding.value;
    view.fit(bbox, { ...options, padding });
  }

  function onSearchSelected(view: any, bbox: BBox) {
    setBbox(view, bbox, {
      padding: currentPadding.value,
      maxZoom: 17,
      easing: easeOut,
      duration: 1000,
    });
  }

  return {
    rdProjection,
    center,
    zoom,
    projection,
    currentPadding,
    setBbox,
    onSearchSelected,
  };
}
