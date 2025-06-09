<script setup lang="ts">
import BaseLayout from '~/components/BaseLayout.vue';

useSeoMeta({
  title: "Fietsersbond Deventer - Projecten",
  description: "Projecten op de kaart",
});
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <BaseLayout>
      <template #nav>
        <NavBar />
      </template>
    </BaseLayout>
  </NuxtLayout>
</template>

<style>
html,
body {
  height: 100%;
}
</style>
