export type ConfigTileLayer = {
  type: "tile";
  url: string;
  attribution: string;
};

export type ConfigWMTSLayer = {
  type: "wmts";
  layer: string;
  url: string;
  style?: string;
  format?: string;
  tilematrixset?: string;
  version?: string;
  attribution: string;
  crs?: string;
};

export type ConfigWMSLayer = {
  type: "wms";
  url: string;
  layers: string;
  format?: string;
  attribution: string;
};

export type ConfigLayer = {
  name: string;
  visible: boolean;
  layer: (ConfigTileLayer | ConfigWMTSLayer | ConfigWMSLayer)[];
};
