<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add target</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="navigateTo('/targets')"
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
          <UButton :disabled="loading" :loading="loading" @click="throttleAddTarget">Add</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const toast = useToast()

const providers = ['Telegram']
const { data: targets } = useNuxtData<Array<Target>>('targets')

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

  if (Object.values(errors).filter((error) => error).length) {
    return
  }

  const body = {
    ...target,
    target: target.target.trim(),
  }

  if (body.provider === 'Telegram') {
    if (body.target.charAt(0) !== '@') {
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
    targets.value?.push(newTarget)
    toast.add({
      title: `Target '${newTarget.provider} - ${newTarget.target}' added`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    navigateTo(`/targets/${newTarget.id}/confirm`)
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}

const throttleAddTarget = useThrottleFn(addTarget, 1000)
onKeyStroke('Enter', throttleAddTarget)
</script>
