<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete alert</h3>
          <ButtonClose :to="`/sites/${siteId}/alerts`" />
        </div>
      </template>

      Delete alert?

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" :to="`/sites/${siteId}/alerts`">Cancel</UButton>
          <UButton :disabled="loading" :loading="loading" @click="deleteAlert">Delete</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const {
  params: { siteId, alertId },
} = useRoute()
const toast = useToast()
const alerts = useState<Array<Alert>>('alerts')

const alert = ref(alerts.value.find((a) => a.id === alertId))
const loading = ref(false)

async function deleteAlert() {
  try {
    loading.value = true
    await $fetch(`/api/alerts/${alertId}`, { method: 'DELETE' })
    alerts.value = alerts.value.filter((a) => a.id !== alert.value?.id)
    toast.add({ title: 'Alert deleted' })
    navigateTo(`/sites/${siteId}/alerts`)
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>
