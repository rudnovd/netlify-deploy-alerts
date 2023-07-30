<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Targets</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" to="/sites" />
        </div>
      </template>

      <ul v-if="targets?.length" class="grid gap-y-2 grid-cols-1 place-content-start">
        <TargetItem v-for="target in targets" :key="target.id" :target="target" />
      </ul>

      <UButton class="flex justify-center mt-2 w-full" to="/targets/add">Add target</UButton>
    </UCard>

    <NuxtPage></NuxtPage>
  </UModal>
</template>

<script setup lang="ts">
const targets = useState<Array<Target>>('targets', () => [])
</script>
