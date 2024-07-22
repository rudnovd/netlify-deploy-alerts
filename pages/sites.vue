<template>
  <div class="py-4">
    <section v-if="!sites?.length" class="h-screen flex items-center justify-center">
      <UButton class="flex items-center justify-center" to="/sites/add"> Add first site </UButton>
    </section>
    <section v-else class="index">
      <section class="flex flex-col gap-2">
        <ul class="grid gap-y-2 grid-cols-1 place-content-start">
          <SiteItem
            v-for="site in sites"
            :key="site.id"
            :site="site"
            :active="siteId === site.id"
            @click="navigateTo(`/sites/${site.id}/alerts`)"
          />
        </ul>

        <UButton class="flex items-center justify-center" to="/sites/add"> Add site </UButton>
        <div class="flex justify-end items-end gap-2">
          <UButton class="ml-auto width-auto" size="xs" icon="i-heroicons-paper-airplane" to="/targets" />
          <UButton size="xs" icon="i-heroicons-arrow-left-on-rectangle" to="/signout" />
        </div>
      </section>

      <NuxtPage :page-key="`/sites/add`" />
    </section>
  </div>
</template>

<script setup lang="ts">
useFetch<Array<Event>>('/api/events', { key: 'events', lazy: true })
useFetch<Array<Alert>>('/api/alerts', { key: 'alerts', lazy: true })
useFetch<Array<Target>>('/api/targets', { key: 'targets', lazy: true })
const { data: sites } = await useFetch<Array<Site>>('/api/sites', { key: 'sites' })
const siteId = useState<string | null>('selectedSite')

definePageMeta({ keepalive: true })
</script>

<style scoped>
.index {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 1rem;
  height: inherit;
}

@media (max-width: 768px) {
  .index {
    grid-template-columns: 1fr;
    height: auto;
  }
}
</style>
