<template>
  <li
    :class="['site flex justify-between items-center p-2 rounded border-2 cursor-pointer', { 'bg-green-600': active }]"
  >
    <span class="truncate" :title="site.url">{{ site.url }}</span>

    <section v-if="active" class="flex gap-1 items-center" @click.stop>
      <UButton
        size="xs"
        icon="i-heroicons-wrench"
        title="Go to Netlify dashboard"
        :to="`https://app.netlify.com/sites/${site.url.split('.')[0]}/configuration/deploys#deploy-notifications`"
        target="_blank"
      />
      <UButton size="xs" icon="i-heroicons-pencil" :to="`/sites/${site.id}/edit`" />
      <UButton size="xs" icon="i-heroicons-trash" :to="`/sites/${site.id}/delete`" />
      <UToggle v-model="site.enabled" :disabled="loading" @click="changeSiteEnabled" />
    </section>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  site: Site
  active: boolean
}>()

const toast = useToast()
const sites = useState<Array<Site>>('sites', () => [])
const site = toRef(props, 'site')
const loading = ref(false)

async function changeSiteEnabled() {
  try {
    loading.value = true
    const changedSite = await $fetch<Site>(`/api/sites/${site.value.id}`, {
      method: 'PUT',
      body: { enabled: !site.value.enabled },
    })
    const editedSiteIndex = sites.value?.findIndex((s: Site) => s.id === changedSite.id)
    if (editedSiteIndex && editedSiteIndex !== -1) {
      sites.value?.splice(editedSiteIndex, 1, changedSite)
    }
    toast.add({ title: `${changedSite.url} ${changedSite.enabled ? 'enabled' : 'disabled'}` })
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
