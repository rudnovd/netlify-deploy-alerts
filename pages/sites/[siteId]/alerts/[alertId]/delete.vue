<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete alert</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="router.back" />
        </div>
      </template>

      Delete alert?

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" @click="router.back">Cancel</UButton>
          <UButton :disabled="loading" :loading="loading" @click="deleteAlert">Delete</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const toast = useToast()
const alerts = useState<Array<Alert>>('alerts')

const alert = ref(alerts.value.find((a) => a.id === route.params.alertId))
const loading = ref(false)

async function deleteAlert() {
  try {
    loading.value = true
    await $fetch(`/api/alerts/${route.params.alertId}`, { method: 'DELETE' })
    alerts.value = alerts.value.filter((a) => a.id !== alert.value?.id)
    toast.add({ title: 'Alert deleted' })
    navigateTo(`/sites/${route.params.siteId}/alerts`)
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>
