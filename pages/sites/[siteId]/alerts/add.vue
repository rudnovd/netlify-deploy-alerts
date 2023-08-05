<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Create new alert</h3>
          <ButtonClose :to="`/sites/${siteId}/alerts`" />
        </div>
      </template>

      <section class="mt-2 flex flex-col gap-2">
        <UFormGroup label="Target" required :error="errors?.target">
          <USelectMenu v-model="target" :options="targetsOptions" @update:model-value="alert.target = $event.value" />
        </UFormGroup>

        <UFormGroup label="Event" required :error="errors?.event">
          <USelectMenu v-model="event" :options="eventsOptions" @update:model-value="alert.event = $event.value" />
        </UFormGroup>

        <UFormGroup label="Message" required :error="errors?.message">
          <UTextarea v-model="alert.text" autoresize />
        </UFormGroup>

        <section class="flex gap-2">
          <UBadge v-if="site" class="cursor-pointer" @click="addText(site.url)">{{ site.url }}</UBadge>
          <UBadge v-if="event" class="cursor-pointer" @click="addText(event.label)">{{ event.label }}</UBadge>
        </section>
      </section>

      <template #footer>
        <section class="flex justify-end">
          <UButton :loading="loading" @click="addAlert">Create alert</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const {
  params: { siteId },
} = useRoute()
const toast = useToast()

const targets = useState<Array<Target>>('targets', () => [])
const events = useState<Array<Event>>('events', () => [])
const alerts = useState<Array<Alert>>('alerts', () => [])
const sites = useState<Array<Site>>('sites', () => [])

const site = computed(() => sites.value.find((site) => site.id === siteId))

const errors = reactive({
  target: '',
  event: '',
  message: '',
})

const targetsOptions = computed(() => {
  return targets.value.map((target) => ({
    label: `${target.provider} - ${target.target}`,
    value: target.id,
  }))
})

const eventsOptions = computed(() => {
  return events.value.map((event) => ({
    label: event.name,
    value: event.id,
  }))
})

const target = ref<{ label: string; value: string }>()
const event = ref<{ label: string; value: string }>()
const alert = reactive<Pick<Alert, 'target' | 'event' | 'site' | 'text'>>({
  target: '',
  event: '',
  site: siteId.toString() ?? '',
  text: '',
})
const loading = ref(false)

function addText(text: string) {
  alert.text += `
${text}`
}

async function addAlert() {
  errors.target = !alert.target ? 'Target is required' : ''
  errors.event = !alert.event ? 'Event is required' : ''
  errors.message = !alert.text ? 'Message is required' : ''
  if (errors.target || errors.event || errors.message) {
    return
  }

  try {
    loading.value = true
    const newAlert = await $fetch<Alert>('/api/alerts', { method: 'POST', body: alert })
    alerts.value.push(newAlert)
    navigateTo(`/sites/${siteId}/alerts`)
    toast.add({ title: 'Alert created', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    loading.value = false
  }
}
</script>
