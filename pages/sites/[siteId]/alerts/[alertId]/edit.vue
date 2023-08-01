<template>
  <UModal :model-value="true" prevent-close>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Create new alert</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            :to="`/sites/${route.params.siteId}/alerts`"
          />
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
          <UButton :loading="loading" @click="saveAlert">Save alert</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const toast = useToast()

const targets = useState<Array<Target>>('targets', () => [])
const events = useState<Array<Event>>('events', () => [])
const alerts = useState<Array<Alert>>('alerts', () => [])
const sites = useState<Array<Site>>('sites', () => [])

const site = computed(() => sites.value.find((site) => site.id === route.params.siteId))
const selectedAlert = ref(alerts.value.find((a) => a.id === route.params.alertId))

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
  site: route.params.siteId.toString() || '',
  text: '',
})
const loading = ref(false)

if (selectedAlert.value) {
  alert.target = selectedAlert.value.target
  alert.event = selectedAlert.value.event
  alert.text = selectedAlert.value.text
  if (alert.target) {
    const _target = targets.value.find((target) => target.id === alert.target)
    if (_target) {
      target.value = { label: _target.target, value: _target.id }
    }
  }
  if (alert.event) {
    const _event = events.value.find((event) => event.id === alert.event)
    if (_event) {
      event.value = { label: _event.name, value: _event.id }
    }
  }
}

function addText(text: string) {
  alert.text += `
${text}`
}

async function saveAlert() {
  errors.target = !alert.target ? 'Target is required' : ''
  errors.event = !alert.event ? 'Event is required' : ''
  errors.message = !alert.text ? 'Message is required' : ''
  if (errors.target || errors.event || errors.message) {
    return
  }

  try {
    loading.value = true
    const editedAlert = await $fetch<Alert>(`/api/alerts/${selectedAlert.value?.id}`, { method: 'PUT', body: alert })
    const editedAlertIndex = alerts.value?.findIndex((alert) => alert.id === editedAlert.id)
    if (editedAlertIndex !== -1) {
      alerts.value?.splice(editedAlertIndex, 1, editedAlert)
    }
    toast.add({ title: 'Alert saved' })
    navigateTo(`/sites/${route.params.siteId}/alerts`)
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>
