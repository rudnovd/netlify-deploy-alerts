<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Edit target</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" to="/targets" />
        </div>
      </template>

      <section class="flex flex-col gap-2">
        <UFormGroup label="Provider" required>
          <USelectMenu v-model="target.provider" :options="providers" />
        </UFormGroup>

        <UFormGroup v-if="target?.provider === 'Telegram'" label="Username" required :error="errors.target">
          <UInput v-model="target.target" placeholder="@durov" icon="i-heroicons-user" />
        </UFormGroup>
      </section>

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" :loading="loading" @click="editTarget">Save</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const targets = useState<Array<Target>>('targets', () => [])

const providers = ['Telegram']
const loading = ref(false)
const target = ref<Pick<Target, 'provider' | 'target'>>({
  provider: 'Telegram',
  target: '',
})
const errors = reactive({
  provider: '',
  target: '',
})

const _target = targets.value.find((target) => target.id === route.params.targetId)
if (_target) {
  target.value = _target
}

async function editTarget() {
  errors.target = !target.value.target ? 'Target required' : ''
  if (errors.target) {
    return
  }

  const body = {
    provider: target.value.provider,
    target: target.value.target.trim(),
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
    const editedTarget = await $fetch<Target>(`/api/targets/${route.params.targetId}`, {
      method: 'PUT',
      body,
    })
    const editedTargetIndex = targets.value?.findIndex((target) => target.id === editedTarget.id)
    if (editedTargetIndex !== -1) {
      targets.value?.splice(editedTargetIndex, 1, editedTarget)
    }
    toast.add({ title: `Target ${editedTarget.target} updated`, color: 'green', icon: 'i-heroicons-check-circle' })
    navigateTo(`/targets/${editedTarget.id}/confirm`)
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    loading.value = false
  }
}
</script>
