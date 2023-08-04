<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

watchEffect(() => {
  if (router.currentRoute.value.name === 'sites-siteId') {
    router.push(`/sites/${route.params.siteId}/alerts`)
  }
})
</script>
