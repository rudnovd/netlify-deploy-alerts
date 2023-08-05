<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add target</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" to="/targets" />
        </div>
      </template>

      <section class="flex flex-col gap-2">
        <UFormGroup label="Provider" required :error="errors.provider">
          <USelectMenu v-model="target.provider" :options="providers" />
        </UFormGroup>

        <UFormGroup v-if="target.provider === 'Telegram'" label="Username" required :error="errors.target">
          <UInput v-model="target.target" placeholder="@durov" icon="i-heroicons-user" />
        </UFormGroup>
      </section>

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" :loading="loading" @click="addTarget">Add</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const toast = useToast()

const providers = ['Telegram']
const targets = useState<Array<Target>>('targets', () => [])

const loading = ref(false)
const target = reactive({
  provider: providers[0],
  target: '',
})
const errors = reactive({
  provider: '',
  target: '',
})

async function addTarget() {
  errors.provider = !target.provider ? 'Provider is required' : ''
  errors.target = !target.target ? 'Target is required' : ''

  if (errors.provider || errors.target) {
    return
  }

  const body = {
    ...target,
    target: target.target.trim(),
  }

  if (body.provider === 'Telegram') {
    if (body.target[0] !== '@') {
      body.target = `@${body.target}`
    }
    errors.target = body.target.length < 6 ? 'Telegram username must be at least 5 characters' : ''
  }

  if (errors.target) {
    return
  }

  try {
    loading.value = true
    const newTarget = await $fetch<Target>('/api/targets', { method: 'POST', body })
    toast.add({
      title: `Target '${newTarget.provider} - ${newTarget.target}' added`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    navigateTo(`/targets/${newTarget.id}/confirm`)
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    loading.value = false
  }
}
</script>
