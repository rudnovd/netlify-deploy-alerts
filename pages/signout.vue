<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Sign out</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            :to="siteId ? `/sites/${siteId}/alerts` : `/sites`"
          />
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
const { auth } = useSupabaseAuthClient()
const toast = useToast()

const siteId = useState<string | undefined>('selectedSite')

async function signOut() {
  try {
    await auth.signOut()
    navigateTo('/')
    toast.add({ title: 'Signed out successfully' })
  } catch (error) {
    const err = error as Error
    toast.add({ title: err.message })
  }
}
</script>
