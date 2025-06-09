<template>
  <MapLayout>
    <template #content>
      <template v-if="route.name === 'iframe'">
        <WelcomePanel title="Fietsersbond Deventer" />
      </template>
      <NuxtPage />
    </template>
  </MapLayout>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Kaart",
  layout: "empty",
});

const route = useRoute();
useMapEventBus().provide();
</script>
