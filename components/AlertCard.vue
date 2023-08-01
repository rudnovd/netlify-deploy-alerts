<template>
  <div class="alert-card">
    <span>on {{ event?.name }}</span>
    <span>
      <a
        v-if="target?.provider !== providerLink"
        :href="providerLink"
        target="_blank"
        class="font-medium text-blue-600 dark:text-blue-500 underline"
      >
        {{ target?.provider }}
      </a>
      <span v-else> {{ target?.provider }}</span>
      {{ ` - ${target?.target}` }}
      <NuxtLink
        v-if="!target?.confirmed"
        :to="`/targets/${target?.id}/confirm`"
        class="text-red-600 font-medium underline"
      >
        (not confirmed)
      </NuxtLink>
    </span>
    <span>{{ alert.text }}</span>

    <div class="flex items-center justify-between gap-2">
      <div class="alert-link">
        <UButton
          size="xs"
          icon="i-heroicons-link"
          @click="copyLink(`https://netlifydeployalerts.netlify.app/api/send/${alert.id}`)"
        />
        <UInput :value="`https://netlifydeployalerts.netlify.app/api/send/${alert.id}`" disabled />
      </div>
      <div class="flex gap-2 items-center">
        <UButton size="xs" icon="i-heroicons-pencil" :to="`/sites/${route.params.siteId}/alerts/${alert.id}/edit`" />
        <UButton
          :disabled="loading"
          size="xs"
          icon="i-heroicons-trash"
          :to="`/sites/${route.params.siteId}/alerts/${alert.id}/delete`"
        />
        <UToggle v-model="alert.enabled" :disabled="loading" @click="changeAlertEnabled" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ alert: Alert }>()
const route = useRoute()
const alert = toRef(props.alert)
const config = useRuntimeConfig()

const toast = useToast()

const targets = useState<Array<Target>>('targets')
const events = useState<Array<{ id: string; name: string }>>('events')
const alerts = useState<Array<Alert>>('alerts')

const loading = ref(false)

const target = computed(() => targets.value?.find((target) => target.id === alert.value.target))
const event = computed(() => events.value?.find((event) => event.id === alert.value.event))
const providerLink = computed(() => {
  if (target.value?.provider === 'Telegram') {
    return config.public.telegramBotLink
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
