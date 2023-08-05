<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const route = useRoute()
const toast = useToast()

const targets = useState<Array<Target>>('targets', () => [])

const target = computed(() => targets.value.find((target) => target.id === route.params.targetId))

if (!target.value) {
  try {
    const _target = await $fetch<Target>(`/api/targets/${route.params.targetId}`)
    targets.value.push(_target)
  } catch (error) {
    const { statusMessage } = error as FetchError
    toast.add({ title: statusMessage, color: 'red', icon: 'i-heroicons-x-circle' })
    navigateTo({ path: '/targets' })
  }
}
</script>
