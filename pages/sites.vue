<template>
  <div class="py-4 h-screen">
    <section v-if="!sites?.length" class="h-screen flex items-center justify-center">
      <UButton class="flex items-center justify-center" to="/sites/add"> Add first site </UButton>
    </section>

    <section v-if="sites?.length" class="index">
      <section class="flex flex-col gap-2">
        <ul class="grid gap-y-2 grid-cols-1 place-content-start">
          <SiteItem
            v-for="site in sites"
            :key="site.id"
            :site="site"
            :active="route.params.siteId === site.id"
            @click="navigateTo(`/sites/${site.id}/alerts`)"
          />
        </ul>

        <UButton class="flex items-center justify-center" to="/sites/add"> Add site </UButton>
        <div class="flex justify-end items-end gap-2">
          <UButton class="ml-auto width-auto" size="xs" icon="i-heroicons-paper-airplane" to="/targets" />
          <UButton size="xs" icon="i-heroicons-arrow-left-on-rectangle" to="/signout" />
        </div>
      </section>

      <NuxtPage :page-key="`/sites/${route.params.siteId}`"></NuxtPage>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: eventsData } = useFetch<Array<Event>>('/api/events')
const { data: sitesData } = useFetch<Array<Site>>('/api/sites')
const { data: alertsData } = useFetch<Array<Alert>>('/api/alerts')
const { data: targetsData } = useFetch<Array<Target>>('/api/targets')
const route = useRoute()
useState('alerts', () => alertsData)
const sites = useState('sites', () => sitesData)
useState('targets', () => targetsData)
useState('events', () => eventsData)
</script>

<style scoped>
.index {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  height: inherit;
}
.site {
  min-height: 48px;
}

@media (max-width: 768px) {
  .index {
    grid-template-columns: 1fr;
    height: auto;
  }
}
</style>
