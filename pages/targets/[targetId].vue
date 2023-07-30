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
    const err = error as FetchError
    toast.add({ title: err.message })
    navigateTo({ path: '/targets' })
  }
}
</script>
