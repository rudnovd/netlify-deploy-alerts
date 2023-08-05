<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add site</h3>
          <ButtonClose :to="siteId ? `/sites/${siteId}/alerts` : '/sites'" />
        </div>
      </template>

      <UFormGroup name="url" required :error="errors?.url">
        <UInput
          v-model="url"
          maxlength="255"
          type="url"
          required
          placeholder="https://netlifydeployalerts.netlify.app"
          icon="i-heroicons-link"
        />
      </UFormGroup>

      <template #footer>
        <section class="flex justify-end">
          <UButton :disabled="loading" :loading="loading" @click="addSite">Add</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const toast = useToast()
const sites = useState<Array<Site>>('sites', () => [])
const siteId = useState<string | null>('selectedSite')

const loading = ref(false)
const url = ref('')
const errors = reactive({
  url: '',
})

async function addSite() {
  const body = {
    url: url.value,
  }

  errors.url = !body.url ? 'URL is required' : ''

  if (errors.url) {
    return
  }

  try {
    const newSite = await $fetch<Site>('/api/sites', {
      method: 'POST',
      body,
    })
    sites.value.push(newSite)
    toast.add({ title: `${newSite.url} added`, color: 'green', icon: 'i-heroicons-check-circle' })
    navigateTo(`/sites/${newSite.id}`)
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    loading.value = false
  }
}
</script>
