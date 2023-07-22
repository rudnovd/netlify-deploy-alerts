<template>
  <UButton class="flex items-center justify-center" @click="newSiteModalIsOpen = true">
    <slot>Add site</slot>
  </UButton>

  <UModal v-model="newSiteModalIsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add site</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="newSiteModalIsOpen = false"
          />
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
const newSiteModalIsOpen = ref(false)

const sites = useState<Array<Site>>('sites', () => [])

const toast = useToast()

const url = ref('')
const loading = ref(false)
const errors = reactive({
  url: '',
})

async function addSite() {
  const urlRegexp = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i
  const urlWithProtocol =
    url.value.includes('https://') || url.value.includes('http://') ? url.value : `https://${url.value}`

  errors.url = !urlRegexp.test(urlWithProtocol) ? 'Invalid URL' : ''

  if (errors.url) {
    return
  }

  try {
    const addedSite = await $fetch<Site>('/api/sites', {
      method: 'POST',
      body: { url: url.value },
    })
    sites.value.push(addedSite)
    newSiteModalIsOpen.value = false
    toast.add({ title: `${url.value} added` })
    url.value = ''
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>
