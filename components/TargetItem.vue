<template>
  <li class="flex justify-between items-center p-2 rounded border-2 cursor-pointer">
    <span>{{ target.provider }} - {{ target.target }}</span>

    <section class="flex gap-1 items-center">
      <UButton
        v-if="!target.confirmed"
        size="xs"
        color="red"
        icon="i-heroicons-exclamation-triangle"
        title="Not confirmed"
        :to="`/targets/${target.id}/confirm`"
      />
      <UButton v-else disabled size="xs" icon="i-heroicons-check" />
      <UButton size="xs" icon="i-heroicons-pencil" :to="`/targets/${target.id}/edit`" />
      <UButton size="xs" icon="i-heroicons-trash" :to="`/targets/${target.id}/delete`" />
    </section>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  target: Target
}>()
</script>
