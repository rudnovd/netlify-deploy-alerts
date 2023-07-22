<template>
  <div class="py-4 h-screen">
    <section v-if="!user" class="h-screen flex items-center justify-center">
      <UButton size="xl" @click="signIn"> Login </UButton>
    </section>

    <section v-if="user && !sites?.length" class="h-screen flex items-center justify-center">
      <AddSite>Add first site</AddSite>
    </section>

    <section v-if="user && sites?.length" class="index">
      <section class="flex flex-col gap-2">
        <ListSites :selected-site="selectedSite" @select-site="selectedSite = $event" />
        <AddSite />
        <div class="flex justify-end items-end gap-2">
          <UButton
            v-if="user"
            class="ml-auto width-auto"
            size="xs"
            icon="i-heroicons-paper-airplane"
            @click="targetsListModalIsOpen = true"
          />
          <UButton
            v-if="user"
            size="xs"
            icon="i-heroicons-arrow-left-on-rectangle"
            @click="signOutModalIsOpen = true"
          />
        </div>
      </section>

      <section v-if="!targets?.length">
        <AddTarget v-if="!targets?.length" />
      </section>

      <section v-if="targets?.length">
        <div v-if="selectedSite?.id && !currentSiteAlerts?.length" class="grid place-items-center gap-y-2">
          No alerts added yet
          <AddAlert :site="selectedSite" @create="onCreateAlert" />
        </div>

        <div v-else-if="selectedSite?.id && currentSiteAlerts?.length" class="grid gap-y-2">
          <div v-for="alert in currentSiteAlerts" :key="alert.id">
            <alert-card :alert="alert" />
          </div>
          <AddAlert :site="selectedSite" @create="onCreateAlert" />
        </div>
      </section>
    </section>

    <UModal v-model="signOutModalIsOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Sign out</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="signOutModalIsOpen = false"
            />
          </div>
        </template>

        Are you sure you want to sign out?

        <template #footer>
          <section class="flex justify-end gap-2">
            <UButton @click="signOutModalIsOpen = false">Cancel</UButton>
            <UButton @click="signOut">Sign out</UButton>
          </section>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="targetsListModalIsOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Targets</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="targetsListModalIsOpen = false"
            />
          </div>
        </template>

        <ListTargets />
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { data: eventsData } = useFetch<Array<Event>>('/api/events')
const { data: sitesData } = useFetch<Array<Site>>('/api/sites')
const { data: alertsData } = useFetch<Array<Alert>>('/api/alerts')
const { data: targetsData } = useFetch<Array<Target>>('/api/targets')
const { auth } = useSupabaseAuthClient()
const user = useSupabaseUser()
const toast = useToast()

const alerts = useState('alerts', () => alertsData)
const sites = useState('sites', () => sitesData)
const targets = useState('targets', () => targetsData)
useState('events', () => eventsData)

const signOutModalIsOpen = ref(false)
const targetsListModalIsOpen = ref(false)
const selectedSite = ref<Site>()

const currentSiteAlerts = computed(() => {
  return alerts.value?.filter((alert) => alert.site === selectedSite?.value?.id)
})

function onCreateAlert(alert: Alert) {
  alerts.value?.push(alert)
}

async function signIn() {
  try {
    await auth.signInWithOAuth({ provider: 'github' })
    toast.add({ title: 'Signed in successfully' })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  }
}

async function signOut() {
  try {
    await auth.signOut()
    signOutModalIsOpen.value = false
    toast.add({ title: 'Signed out successfully' })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  }
}
</script>

<style scoped>
.index {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  height: inherit;
}

@media (max-width: 768px) {
  .index {
    grid-template-columns: 1fr;
    height: auto;
  }
}
</style>
