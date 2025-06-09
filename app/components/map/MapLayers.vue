<template>
  <div>
    <ol-tile-layer ref="light" title="Licht" :visible="true" :base-layer="true">
      <ol-source-stadia-maps layer="alidade_smooth" />
    </ol-tile-layer>

    <ol-tile-layer
      ref="fietskaart"
      title="Fiets"
      :visible="false"
      :base-layer="true"
    >
      <ol-source-xyz
        url="https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
        attributions='&copy; <a href="http://opencyclemap.org">OpenCycleMap</a>'
      />
    </ol-tile-layer>

    <ol-tile-layer
      ref="luchtfoto"
      title="Foto"
      :visible="false"
      :base-layer="true"
    >
      <ol-source-tile-wms
        ref="luchtfoto-source"
        url="https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0"
        layers="Actueel_ortho25"
        attributions='&copy; <a href="https://www.kadaster.nl">Kadaster</a>'
        :preview="getPreview('/preview-luchtfoto.png')"
      />
    </ol-tile-layer>

    <ol-tile-layer
      ref="lufolabels"
      title="Straatnamen"
      :visible="false"
      :display-in-layer-switcher="false"
    >
      <ol-source-wmts
        ref="lufolabels-source"
        url="https://service.pdok.nl/bzk/luchtfotolabels/wmts/v1_0"
        layer="lufolabels"
        :projection="rdProjection"
        matrix-set="EPSG:28992"
        format="image/png"
        :display-in-layer-switcher="false"
        :preview="getPreview('/preview-lufolabels.png')"
      />
    </ol-tile-layer>

    <ol-vector-layer ref="vectorLayer" :display-in-layer-switcher="false">
      <slot />
    </ol-vector-layer>
  </div>
</template>

<script setup lang="ts">
import { useMapLayers } from "~/composables/useMapLayers";
import { useMapViewConfig } from "~/composables/useMapViewConfig";

const { getPreview, setupLuchtfotoSource, setupLabelsSource } = useMapLayers();
const { rdProjection } = useMapViewConfig();

const lufolabelsSource = useTemplateRef("lufolabels-source");
const luchtfotoSource = useTemplateRef("luchtfoto-source");

watch(luchtfotoSource, setupLuchtfotoSource);
watch(lufolabelsSource, setupLabelsSource);
</script>
