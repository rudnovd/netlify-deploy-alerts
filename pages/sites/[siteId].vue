<template>
  <NuxtPage :page-key="`/sites/${router.currentRoute.value.params.siteId}/alerts`" />
</template>

<script setup lang="ts">
const router = useRouter()

watchEffect(() => {
  if (router.currentRoute.value.name === 'sites-siteId') {
    router.push(`/sites/${router.currentRoute.value.params.siteId}/alerts`)
  }
})
</script>
