import * as L from "leaflet";
import "proj4leaflet";

export function addRD() {
  const crs = new L.Proj.CRS(
    "EPSG:28992",
    "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 " +
      "+k=0.9999079 +x_0=155000 +y_0=463000 " +
      "+ellps=bessel +towgs84=565.2369,50.0087,465.658,0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +units=m +no_defs",
    {
      origin: [0, 0],
      resolutions: [
        3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44,
        6.72, 3.36, 1.68, 0.84, 0.42, 0.21,
      ],
      bounds: L.bounds([64698, 30800], [276241, 636000]),
    }
  );
  L.CRS["EPSG:28992"] = crs;

  return crs;
}
