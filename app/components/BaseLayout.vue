<template>
  <v-app>
    <slot name="nav" />
    <v-main>
      <NuxtErrorBoundary>
        <template #error="{ error, clearError }">
          You can display the error locally here: {{ error }}
          <button @click="clearError">This will clear the error.</button>
        </template>
      </NuxtErrorBoundary>

      <slot>
        <NuxtPage />
      </slot>

      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
      >
        {{ snackbar.text }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useSnackbar } from '~/composables/useSnackbar';
const { snackbar } = useSnackbar();
</script>
