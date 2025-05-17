import type { ConfigLayer } from "~/types/LayerConfig";

export function getConfig(): {
  baseLayers: ConfigLayer[];
} {
  return {
    baseLayers: [
      {
        name: "licht",
        visible: true,
        layer: [
          {
            type: "tile",
            url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_light/{z}/{x}/{y}{r}.png",
            attribution: `© <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, © <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>, © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
          },
        ],
      },
      {
        name: "Luchtfoto",
        visible: false,
        layer: [
          {
            type: "wms",
            url: "https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0",
            layers: "Actueel_ortho25",
            format: "image/jpeg",
            attribution:
              '&copy; <a href="https://www.kadaster.nl">Kadaster</a>',
          },
          {
            type: "wmts",
            url: "https://service.pdok.nl/bzk/luchtfotolabels/wmts/v1_0",
            layer: "lufolabels",
            tilematrixset: "EPSG:28992",
            crs: "EPSG:28992",
            attribution:
              '&copy; <a href="https://www.kadaster.nl">Kadaster</a>',
          },
        ],
      },
      {
        name: "Fietskaart",
        visible: false,
        layer: [
          {
            type: "tile",
            // url: "https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
            attribution:
              '&copy; <a href="http://opencyclemap.org">OpenCycleMap</a>',
          },
        ],
      },
      // {
      //   type: "tile",
      //   name: "Kaart",
      //   url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      //   attribution:
      //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      //   visible: false,
      // },
    ],
  };
}
