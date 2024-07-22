<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete site</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="navigateTo(`/sites/${route.params.siteId}`)"
          />
        </div>
      </template>

      Delete {{ site?.url ?? 'Site' }}?

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" @click="router.back">Cancel</UButton>
          <UButton :disabled="loading" :loading="loading" @click="deleteSite">Delete</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const { data: sites } = useNuxtData<Array<Site>>('sites')

const site = ref(sites.value?.find((site) => site.id === siteId))
const loading = ref(false)

async function deleteSite() {
  try {
    loading.value = true
    await $fetch(`/api/sites/${siteId}`, { method: 'DELETE' })
    if (!sites.value) {
      sites.value = []
    }
    sites.value = sites.value?.filter((site) => site.id !== siteId)
    toast.add({ title: `${site.value?.url} deleted`, color: 'green', icon: 'i-heroicons-check-circle' })
    navigateTo('/sites')
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>
