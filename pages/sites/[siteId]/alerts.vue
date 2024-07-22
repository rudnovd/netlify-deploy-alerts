<template>
  <div>
    <section v-if="!targets?.length">
      <UButton class="flex justify-center" to="/sites/targets/add">Add target</UButton>
    </section>

    <section v-if="targets?.length">
      <div v-if="site?.id && !siteAlerts?.length" class="grid place-items-center gap-y-2">
        No alerts added yet
        <UButton class="flex justify-center" :to="`/sites/${siteId}/alerts/add`">Create new alert</UButton>
      </div>

      <div v-else-if="site?.id && siteAlerts?.length" class="grid gap-y-2">
        <div v-for="alert in siteAlerts" :key="alert.id">
          <alert-card :alert="alert" />
        </div>
        <UButton class="flex justify-center" :to="`/sites/${siteId}/alerts/add`">Create new alert</UButton>
      </div>
    </section>

    <NuxtPage :page-key="`/sites/${siteId}/alerts/*`" />
  </div>
</template>

<script setup lang="ts">
const {
  params: { siteId },
} = useRoute()

const { data: alerts } = useNuxtData<Array<Alert>>('alerts')
const { data: sites } = useNuxtData<Array<Site>>('sites')
const { data: targets } = useNuxtData<Array<Target>>('targets')

const site = ref(sites.value?.find((site) => site.id === siteId))
const siteAlerts = computed(() => alerts.value?.filter((alert) => alert.site === siteId))
</script>
