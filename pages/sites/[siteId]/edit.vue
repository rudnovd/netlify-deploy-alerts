<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Edit site</h3>
          <ButtonClose :to="`/sites/${siteId}`" />
        </div>
      </template>

      <UFormGroup name="url" required :error="errors.url">
        <UInput
          v-model.trim="url"
          maxlength="255"
          required
          placeholder="https://netlifydeployalerts.netlify.app"
          icon="i-heroicons-link"
        />
      </UFormGroup>

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" :loading="loading" @click="editSite">Save</UButton>
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
const sites = useState<Array<Site>>('sites', () => [])

const loading = ref(false)
const site = ref(sites.value?.find((site) => site.id === siteId))
const errors = reactive({
  url: '',
})
const url = ref(site.value ? site.value.url : '')

async function editSite() {
  const body = {
    url: url.value,
  }

  errors.url = !body.url ? 'URL is required' : ''
  if (errors.url) {
    return
  }

  try {
    loading.value = true
    const editedSite = await $fetch(`/api/sites/${site.value?.id}`, {
      method: 'PUT',
      body,
    })
    const editedSiteIndex = sites.value?.findIndex((site) => site.id === editedSite.id)
    if (editedSiteIndex !== -1) {
      sites.value?.splice(editedSiteIndex, 1, editedSite)
    }
    toast.add({ title: `${site.value?.url} updated` })
    navigateTo(`/sites/${siteId}/alerts`)
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
    errors.url = err.message
  } finally {
    loading.value = false
  }
}
</script>
