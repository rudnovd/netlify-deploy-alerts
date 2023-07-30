<template>
  <div>
    <section v-if="!targets?.length">
      <UButton class="flex justify-center" to="/targets/add">Add target</UButton>
    </section>

    <section v-if="targets?.length">
      <div v-if="site?.id && !siteAlerts?.length" class="grid place-items-center gap-y-2">
        No alerts added yet
        <UButton class="flex justify-center" :to="`/sites/${route.params.siteId}/alerts/add`">Create new alert</UButton>
      </div>

      <div v-else-if="site?.id && siteAlerts?.length" class="grid gap-y-2">
        <div v-for="alert in siteAlerts" :key="alert.id">
          <alert-card :alert="alert" />
        </div>
        <UButton class="flex justify-center" :to="`/sites/${route.params.siteId}/alerts/add`">Create new alert</UButton>
      </div>
    </section>

    <NuxtPage :page-key="`/sites/${site?.id}/alerts/add`"></NuxtPage>
    <NuxtPage :page-key="`/sites/${site?.id}/edit`"></NuxtPage>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ site?: Site }>()

const route = useRoute()

const alerts = useState<Array<Alert>>('alerts', () => [])
const sites = useState<Array<Site>>('sites', () => [])
const targets = useState<Array<Target>>('targets', () => [])

const site = ref(props.site ?? sites.value.find((s) => s.id === route.params.siteId))
const siteAlerts = computed(() => alerts.value.filter((alert) => alert.site === site.value?.id))
</script>
