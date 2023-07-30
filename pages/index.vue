<template>
  <section class="h-screen flex items-center justify-center">
    <SignInButton v-if="!user" />
    <UButton v-else size="xl" to="/sites"> Launch sites </UButton>
  </section>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>
