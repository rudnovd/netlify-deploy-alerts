<template>
  <ul v-if="sites?.length" class="grid gap-y-2 grid-cols-1 place-content-start">
    <li
      v-for="site in sites"
      :key="site.id"
      :class="[
        'site flex justify-between items-center p-2 rounded border-2 cursor-pointer',
        { 'bg-green-600': selectedSite?.id === site.id },
      ]"
      @click="emit('select-site', site)"
    >
      <span class="truncate" :title="site.url">{{ site.url }}</span>

      <section v-if="selectedSite?.id === site.id" class="flex gap-1 items-center">
        <UButton :disabled="loading" size="xs" icon="i-heroicons-pencil" @click="openEditModal" />
        <UButton :disabled="loading" size="xs" icon="i-heroicons-trash" @click="deleteModalIsOpen = true" />
        <UToggle v-model="site.enabled" @click="changeSiteEnabled(site)" />
      </section>
    </li>
  </ul>

  <UModal v-model="editModalIsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Edit site</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="editModalIsOpen = false"
          />
        </div>
      </template>

      <UFormGroup name="url" required :error="errors.url">
        <UInput
          v-model="url"
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

  <UModal v-model="deleteModalIsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete site</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="deleteModalIsOpen = false"
          />
        </div>
      </template>

      Delete {{ props.selectedSite?.url ?? 'Site' }}?

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" @click="deleteModalIsOpen = false">Cancel</UButton>
          <UButton :disabled="loading" :loading="loading" @click="deleteSite">Delete</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ selectedSite?: Site }>()
const emit = defineEmits(['select-site'])

const toast = useToast()

const sites = useState<Array<Site>>('sites', () => [])

const loading = ref(false)
const editModalIsOpen = ref(false)
const deleteModalIsOpen = ref(false)
const url = ref('')
const errors = reactive({
  url: '',
})

function openEditModal() {
  errors.url = ''
  url.value = props.selectedSite?.url || ''
  editModalIsOpen.value = true
}

async function changeSiteEnabled(site: Site) {
  try {
    loading.value = true
    const data = await $fetch<Site>(`/api/sites/${site.id}`, { method: 'PUT', body: { enabled: !site.enabled } })
    const editedSiteIndex = sites.value?.findIndex((s: Site) => s.id === data.id)
    if (editedSiteIndex && editedSiteIndex !== -1) {
      sites.value?.splice(editedSiteIndex, 1, data)
    }
    toast.add({ title: `${site.url} ${site.enabled ? 'enabled' : 'disabled'}` })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}

async function editSite() {
  const urlRegexp = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i
  const urlWithProtocol =
    url.value.includes('https://') || url.value.includes('http://') ? url.value : `https://${url.value}`

  errors.url = !urlRegexp.test(urlWithProtocol) ? 'Invalid URL' : ''

  if (errors.url) {
    return
  }

  try {
    loading.value = true
    const editedSite = await $fetch(`/api/sites/${props.selectedSite?.id}`, {
      method: 'PUT',
      body: { url: urlWithProtocol },
    })
    const editedSiteIndex = sites.value?.findIndex((s: Site) => s.id === editedSite.id)
    if (editedSiteIndex && editedSiteIndex !== -1) {
      sites.value?.splice(editedSiteIndex, 1, editedSite)
    }
    editModalIsOpen.value = false
    url.value = ''
    emit('select-site', editedSite)
    toast.add({ title: `${props.selectedSite?.url} updated` })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}

async function deleteSite() {
  try {
    loading.value = true
    await $fetch(`/api/sites/${props.selectedSite?.id}`, { method: 'DELETE' })
    sites.value = sites.value.filter((s) => s.id !== props.selectedSite?.id)
    deleteModalIsOpen.value = false
    toast.add({ title: 'Site deleted' })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.site {
  min-height: 48px;
}
</style>
