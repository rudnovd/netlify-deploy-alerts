<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Confirm target</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" to="/targets" />
        </div>
      </template>

      <section>
        <template v-if="target?.provider === 'Telegram'">
          To allow alerts to be sent to <UBadge color="cyan">{{ target.target }}</UBadge
          >, you must send the <UBadge color="cyan">/confirm</UBadge> command to
          <a
            class="font-medium text-blue-600 dark:text-blue-500 underline"
            target="_blank"
            :href="config.public.telegramBotLink"
          >
            {{ config.public.telegramBotLink }}
          </a>
        </template>
      </section>

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :loading="loading" :disabled="loading" @click="checkConfirmation">Check confirmation</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const config = useRuntimeConfig()
const targets = useState<Array<Target>>('targets', () => [])
const siteId = useState<string | null>('selectedSite')

const loading = ref(false)
const target = ref(targets.value.find((target) => target.id === route.params.targetId))

async function checkConfirmation() {
  if (!target.value) {
    return
  }

  try {
    loading.value = true
    const targetForConfirm = await $fetch<Target>(`/api/targets/${target.value.id}`)
    const thisTargetIndex = targets.value.findIndex((t) => t.id === targetForConfirm.id)
    if (targetForConfirm.confirmed) {
      targets.value.splice(thisTargetIndex, 1, targetForConfirm)
      toast.add({
        title: `Target '${targetForConfirm.target}' confirmed`,
        color: 'green',
        icon: 'i-heroicons-check-circle',
      })
      navigateTo({ path: siteId ? `/sites/${siteId}/alerts` : '/sites' })
    } else {
      toast.add({
        title: `Target '${targetForConfirm.target}' not confirmed, use /confirm command again`,
        color: 'red',
        icon: 'i-heroicons-x-circle',
      })
    }
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    loading.value = false
  }
}
</script>
