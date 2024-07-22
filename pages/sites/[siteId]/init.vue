<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Initialize alerts for {{ site?.url }}
          </h3>
          <ButtonClose :to="siteId ? `/sites/${siteId}/alerts` : '/sites'" />
        </div>
      </template>

      <section class="flex flex-col gap-2">
        <UFormGroup name="initial-alerts" label="Select alerts that you want to receive">
          <UCheckbox
            v-for="initialEvent in initialEvents"
            :key="initialEvent.id"
            v-model="selectedEvents"
            :name="initialEvent.name"
            :label="initialEvent.name"
          />
        </UFormGroup>

        <UFormGroup label="Provider" required :error="errors.provider">
          <USelectMenu v-model="target.provider" :options="providers" />
        </UFormGroup>

        <UFormGroup v-if="target.provider === 'Telegram'" label="Username" required :error="errors.target">
          <UInput v-model="target.target" placeholder="@durov" icon="i-heroicons-user" />
        </UFormGroup>
      </section>

      <template #footer>
        <section class="flex justify-end">
          <UButton :disabled="loading" :loading="loading" @click="initializeAlerts">
            <template v-if="selectedEvents.length"> Add {{ selectedEvents.length }} alerts </template>
            <template v-else> Continue </template>
          </UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const toast = useToast()
const { data: alerts } = useNuxtData<Array<Alert>>('alerts')
const { data: sites } = useNuxtData<Array<Site>>('sites')
const { data: events } = useNuxtData<Array<Event>>('events')
const { data: targets } = useNuxtData<Array<Target>>('targets')
const {
  params: { siteId },
} = useRoute()

const providers = ['Telegram']

const loading = ref(false)
const selectedEvents = ref([])
const site = ref(sites.value?.find((site) => site.id === siteId))

const target = reactive({
  provider: providers[0],
  target: '',
})
const errors = reactive({
  provider: '',
  target: '',
})

const initialEventsIds = [
  '3f03cfc5-1761-4a12-bcef-712b05709a84',
  'a5632602-cc8f-43f6-adf6-7a7fe07c6a01',
  '4b55c10b-72e2-4f1f-93ae-31148d582417',
]
const initialEvents = computed(() => events.value?.filter((event) => initialEventsIds.includes(event.id)))

async function initializeAlerts() {
  const newTarget = await addTarget()
  if (newTarget) {
    await Promise.allSettled(
      selectedEvents.value.map((event) => addAlert({ target: newTarget?.id, event, text: event })),
    )
    navigateTo(`/targets/${newTarget.id}/confirm`)
  }
}

async function addTarget() {
  errors.provider = !target.provider ? 'Provider is required' : ''
  errors.target = !target.target ? 'Target is required' : ''

  if (Object.values(errors).filter((error) => error).length) {
    return
  }

  const body = {
    ...target,
    target: target.target.trim(),
  }

  if (body.provider === 'Telegram') {
    if (body.target.charAt(0) !== '@') {
      body.target = `@${body.target}`
    }
    errors.target = body.target.length < 6 ? 'Telegram username must be at least 5 characters' : ''
  }

  if (errors.target) {
    return
  }

  try {
    loading.value = true
    const newTarget = await $fetch<Target>('/api/targets', { method: 'POST', body })
    targets.value?.push(newTarget)
    toast.add({
      title: `Target '${newTarget.provider} - ${newTarget.target}' added`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    return newTarget
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    loading.value = false
  }
}

async function addAlert({ target, event, text }: { target: string; event: string; text: string }) {
  const body = {
    target,
    event,
    site: siteId.toString() ?? '',
    text,
  }
  try {
    loading.value = true
    const newAlert = await $fetch<Alert>('/api/alerts', { method: 'POST', body })
    alerts.value?.push(newAlert)
    toast.add({ title: 'Alert created', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    loading.value = false
  }
}
</script>
