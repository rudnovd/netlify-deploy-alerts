<template>
  <section class="flex flex-col gap-4">
    <ul v-if="targets?.length" class="grid gap-y-2 grid-cols-1 place-content-start">
      <li
        v-for="target in targets"
        :key="target.id"
        :class="['site flex justify-between items-center p-2 rounded border-2 cursor-pointer']"
      >
        <span>{{ target.provider }} - {{ target.target }}</span>

        <section class="flex gap-1 items-center">
          <UButton
            v-if="!target.confirmed"
            size="xs"
            color="red"
            icon="i-heroicons-exclamation-triangle"
            title="Not confirmed"
            @click="openConfirmModal(target)"
          />
          <UButton v-else disabled size="xs" icon="i-heroicons-check" @click="openEditModal(target)" />

          <UButton :disabled="loading" size="xs" icon="i-heroicons-pencil" @click="openEditModal(target)" />
          <UButton :disabled="loading" size="xs" icon="i-heroicons-trash" @click="openDeleteModal(target)" />
        </section>
      </li>
    </ul>

    <AddTarget />
  </section>

  <UModal v-model="editModalIsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Edit target</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="editModalIsOpen = false"
          />
        </div>
      </template>

      <section class="flex flex-col gap-2">
        <UFormGroup label="Provider" required>
          <USelectMenu v-model="selectedTarget.provider" :options="providers" />
        </UFormGroup>

        <UFormGroup v-if="selectedTarget?.provider === 'Telegram'" label="Username" required :error="errors.target">
          <UInput v-model="selectedTarget.target" placeholder="@durov" icon="i-heroicons-user" />
        </UFormGroup>
      </section>

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" :loading="loading" @click="editTarget">Save</UButton>
        </section>
      </template>
    </UCard>
  </UModal>

  <UModal v-model="deleteModalIsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Delete target</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="deleteModalIsOpen = false"
          />
        </div>
      </template>

      Delete target '{{ selectedTarget?.provider }} - {{ selectedTarget?.target }}'?

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :disabled="loading" @click="deleteModalIsOpen = false">Cancel</UButton>
          <UButton :disabled="loading" :loading="loading" @click="deleteTarget">Delete</UButton>
        </section>
      </template>
    </UCard>
  </UModal>

  <UModal v-model="confirmModalIsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Confirm target</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="confirmModalIsOpen = false"
          />
        </div>
      </template>

      <section>
        <template v-if="selectedTarget?.provider === 'Telegram'">
          To allow alerts to be sent to <UBadge color="cyan">{{ selectedTarget.target }}</UBadge
          >, you must send the <UBadge color="cyan">/start</UBadge> command to
          <a
            class="font-medium text-blue-600 dark:text-blue-500 underline"
            target="_blank"
            href="https://t.me/netlifydeployalertsbot"
          >
            https://t.me/netlifydeployalertsbot
          </a>
        </template>
      </section>

      <template #footer>
        <section class="flex justify-end gap-2">
          <UButton :loading="loading" :disabled="loading" @click="checkConfirmation">Check confirmation</UButton>
        </section>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const toast = useToast()

const providers = ['Telegram']

const targets = useState<Array<Target>>('targets', () => [])

const loading = ref(false)
const editModalIsOpen = ref(false)
const deleteModalIsOpen = ref(false)
const confirmModalIsOpen = ref(false)

const selectedTarget = ref<Pick<Target, 'id' | 'provider' | 'target'>>({
  id: '',
  provider: 'Telegram',
  target: '',
})
const errors = reactive({
  provider: '',
  target: '',
})

function openEditModal(target: Target) {
  selectedTarget.value = target
  editModalIsOpen.value = true
}

function openConfirmModal(target: Target) {
  selectedTarget.value = target
  confirmModalIsOpen.value = true
}

function openDeleteModal(target: Target) {
  selectedTarget.value = target
  deleteModalIsOpen.value = true
}

async function editTarget() {
  errors.target = !selectedTarget.value.target ? 'Target required' : ''

  if (errors.target) {
    return
  }

  try {
    loading.value = true
    const editedTarget = await $fetch<Target>(`/api/targets/${selectedTarget.value.id}`, {
      method: 'PUT',
      body: { target: selectedTarget.value.target, provider: selectedTarget.value.provider },
    })
    const editedTargetIndex = targets.value?.findIndex((t: Target) => t.id === editedTarget.id)
    if (editedTargetIndex && editedTargetIndex !== -1) {
      targets.value?.splice(editedTargetIndex, 1, editedTarget)
    }
    editModalIsOpen.value = false
    toast.add({ title: 'Target updated' })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}

async function deleteTarget() {
  try {
    loading.value = true
    await $fetch(`/api/targets/${selectedTarget.value.id}`, { method: 'DELETE' })
    targets.value = targets.value.filter((s) => s.id !== selectedTarget.value?.id)
    deleteModalIsOpen.value = false
    toast.add({ title: `Target '${selectedTarget.value?.provider} - ${selectedTarget.value?.target}' deleted` })
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}

async function checkConfirmation() {
  try {
    loading.value = true
    const target = await $fetch<Target>(`/api/targets/${selectedTarget.value.id}`)
    const thisTargetIndex = targets.value.findIndex((t) => t.id === target.id)
    if (target.confirmed) {
      targets.value.splice(thisTargetIndex, 1, target)
      confirmModalIsOpen.value = false
      toast.add({ title: `Target '${target.target}' confirmed` })
    } else {
      toast.add({ title: `Target '${target.target}' not confirmed, use /start command again` })
    }
  } catch (error) {
    const err = error as FetchError
    toast.add({ title: err.message })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.site {
  min-height: 48px;
}
</style>
