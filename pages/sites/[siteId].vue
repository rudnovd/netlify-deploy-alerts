<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const router = useRouter()

watch(router.currentRoute, (newRoute) => {
  const { path, params } = newRoute
  if (path.split('/').length === 3 && params.siteId) {
    navigateTo(`/sites/${params.siteId}/alerts`)
  }
})
</script>
