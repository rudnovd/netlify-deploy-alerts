<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Sign out</h3>
          <ButtonClose :to="siteId ? `/sites/${siteId}/alerts` : '/sites'" />
        </div>
      </template>

      Are you sure you want to sign out?

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :to="siteId ? `/sites/${siteId}/alerts` : `/sites`">Cancel</UButton>
          <UButton @click="signOut">Sign out</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const { auth } = useSupabaseClient()
const toast = useToast()

const siteId = useState<string | null>('selectedSite')

async function signOut() {
  try {
    await auth.signOut()
    toast.add({ title: 'Signed out successfully', color: 'green', icon: 'i-heroicons-check-circle' })
    navigateTo('/')
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
  }
}
</script>
