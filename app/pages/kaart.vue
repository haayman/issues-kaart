<template>
  <v-container fluid class="fill-height">
    <v-row v-if="!mobile" class="fill-height">
      <v-col class="align-center justify-center">
        <Map />
      </v-col>
      <v-col>
        <div class="navigation-content">
          <div class="main-content">
            <NuxtPage />
          </div>
          <div class="legend-wrapper">
            <MapLegend />
          </div>
        </div>
      </v-col>
    </v-row>
    <div v-else class="d-flex flex-column w-100 fill-height">
      <div class="fill-height">
        <Map />
      </div>
      <div>
        <div class="navigation-content">
          <div class="main-content">
            <NuxtPage />
          </div>
          <div class="legend-wrapper">
            <MapLegend />
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Kaart",
});

useMapEventBus().provide();

const { mobile } = useDisplay();

const { selectedIssueId } = useSelectedIssue();
const { isOpen } = useNavigationDrawer();

// Open drawer when an issue is selected
watch(selectedIssueId, (id) => {
  if (id !== undefined) {
    isOpen.value = true;
  }
});

watch(
  mobile,
  (isMobile) => {
    console.log("mobile changed:", isMobile);
  },
  {
    immediate: true,
  }
);

const reactiveFeature = new ReactiveFeature();
useEditableFeature().provide(reactiveFeature);
</script>

<style>
.leaflet-container {
  height: 100%;
}

.navigation-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.main-content {
  flex: 2;
  overflow-y: auto;
}

.legend-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background: white;
}
</style>
