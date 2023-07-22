<template>
  <UButton class="flex justify-center" @click="newTargetModalIsOpen = true">Add target</UButton>

  <UModal v-model="newTargetModalIsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add target</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="newTargetModalIsOpen = false"
          />
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

const newTargetModalIsOpen = ref(false)
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

  if (target.provider === 'Telegram') {
    if (target.target[0] !== '@') {
      target.target = `@${target.target}`
    }
  }

  try {
    loading.value = true
    const targetsResponse = await $fetch<Target>('/api/targets', { method: 'POST', body: target })
    targets.value.push(targetsResponse)
    toast.add({ title: `Target '${target.provider} - ${target.target}' added` })
    newTargetModalIsOpen.value = false
    target.target = ''
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>
