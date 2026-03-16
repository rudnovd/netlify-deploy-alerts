<template>
  <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" :to="to" />
</template>

<script setup lang="ts">
defineProps<{ to: string }>()
</script>
