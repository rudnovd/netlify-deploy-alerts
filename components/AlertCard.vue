<template>
  <div class="alert-card">
    <span>on {{ event?.name }}</span>
    <span>
      <a
        v-if="target?.provider !== providerLink"
        :href="providerLink"
        class="font-medium text-blue-600 dark:text-blue-500 underline"
        >{{ target?.provider }}</a
      >
      <span v-else> {{ target?.provider }}</span>
      {{ ` - ${target?.target}` }}
    </span>
    <span>{{ alert.text }}</span>

    <div class="flex items-center justify-between gap-2">
      <div class="alert-link">
        <UButton
          size="xs"
          icon="i-heroicons-link"
          @click="copyLink(`https://netlifydeployalerts.com/api/send/${alert.id}`)"
        />
        <UInput :value="`https://netlifydeployalerts.com/api/send/${alert.id}`" disabled />
      </div>
      <div class="flex gap-2 items-center">
        <UToggle v-model="alert.enabled" :disabled="loading" @click="changeAlertEnabled" />
        <UButton :disabled="loading" size="xs" icon="i-heroicons-trash" @click="deleteModalIsOpen = true" />
      </div>
    </div>
  </div>

  <UModal v-model="deleteModalIsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete alert</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="deleteModalIsOpen = false"
          />
        </div>
      </template>

      Delete alert?

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" @click="deleteModalIsOpen = false">Cancel</UButton>
          <UButton :disabled="loading" :loading="loading" @click="deleteAlert">Delete</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ alert: Alert }>()
const alert = toRef(props.alert)

const toast = useToast()

const targets = useState<Array<Target>>('targets')
const events = useState<Array<{ id: string; name: string }>>('events')
const alerts = useState<Array<Alert>>('alerts')

const loading = ref(false)
const deleteModalIsOpen = ref(false)

const target = computed(() => targets.value?.find((target) => target.id === alert.value.target))
const event = computed(() => events.value?.find((event) => event.id === alert.value.event))
const providerLink = computed(() => {
  if (target.value?.provider === 'Telegram') {
    return `https://t.me/netlifydeployalertsbot`
  } else {
    return target.value?.provider
  }
})

async function changeAlertEnabled() {
  try {
    loading.value = true
    const data = await $fetch<Alert>(`/api/alerts/${alert.value.id}`, {
      method: 'PUT',
      body: { enabled: !alert.value.enabled },
    })
    const editedAlertIndex = alerts.value?.findIndex((a: Alert) => a.id === data.id)
    if (editedAlertIndex && editedAlertIndex !== -1) {
      alerts.value?.splice(editedAlertIndex, 1, data)
    }
    toast.add({ title: `Alert ${alert.value.enabled ? 'enabled' : 'disabled'}` })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}

async function deleteAlert() {
  try {
    loading.value = true
    await $fetch(`/api/alerts/${alert.value.id}`, { method: 'DELETE' })
    alerts.value = alerts.value.filter((a) => a.id !== alert.value.id)
    toast.add({ title: 'Alert deleted' })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}

function copyLink(url: string) {
  navigator.clipboard.writeText(url)
  toast.add({ title: 'Alert link copied' })
}
</script>

<style scoped>
.alert-card {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  row-gap: 4px;
}

.alert-link {
  flex: 0 0 80%;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;
}
</style>
