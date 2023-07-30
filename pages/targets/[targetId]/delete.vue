<template>
  <UModal :model-value="true">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete target</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="navigateTo('/targets')"
          />
        </div>
      </template>

      Delete target '{{ target?.provider }} - {{ target?.target }}'?

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" @click="navigateTo('/targets')">Cancel</UButton>
          <UButton :disabled="loading" :loading="loading" @click="deleteTarget">Delete</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const targets = useState<Array<Target>>('targets', () => [])

const target = ref(targets.value.find((target) => target.id === route.params.targetId))
const loading = ref(false)

async function deleteTarget() {
  if (!target.value) {
    return
  }

  try {
    loading.value = true
    await $fetch(`/api/targets/${target.value.id}`, { method: 'DELETE' })
    targets.value = targets.value.filter((_target) => _target.id !== target.value?.id)
    toast.add({ title: `Target '${target.value.provider} - ${target.value.target}' deleted` })
    navigateTo('/targets')
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>
