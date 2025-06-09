import type TileLayer from "ol/layer/Tile";
import { ref, watch } from "vue";

export function useMapLayers() {
  const luchtfotoIsVisible = ref(false);

  function getPreview(url: string) {
    return function () {
      return [url];
    };
  }

  function setupLuchtfotoSource(luchtfotoSource: any) {
    if (luchtfotoSource.layer) {
      const layer = luchtfotoSource.layer as TileLayer;
      layer.getPreview = getPreview("/preview-luchtfoto.png");
      layer.on("change:visible", () => {
        luchtfotoIsVisible.value = layer.getVisible();
      });
    }
  }

  function setupLabelsSource(lufolabelsSource: any) {
    if (lufolabelsSource.tileLayer) {
      const layer = lufolabelsSource.tileLayer as TileLayer;
      layer.getPreview = getPreview("/preview-lufolabels.png");
      watch(luchtfotoIsVisible, (isVisible) => {
        layer.setVisible(isVisible);
      });
    }
  }

  return {
    luchtfotoIsVisible,
    getPreview,
    setupLuchtfotoSource,
    setupLabelsSource,
  };
}
