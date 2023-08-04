<template>
  <section class="h-screen">
    <UContainer>
      <NuxtPage />
    </UContainer>
    <UNotifications />
  </section>
</template>

<script setup lang="ts">
const siteId = useState<string | null>('selectedSite', () => null)
const router = useRouter()

watch(
  router.currentRoute,
  ({ params }) => {
    if (params.siteId) {
      siteId.value = params.siteId.toString()
    }
  },
  { immediate: true },
)
</script>
