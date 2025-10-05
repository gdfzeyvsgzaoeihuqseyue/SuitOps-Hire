<template>
  <img :src="avatarUrl" :alt="authorName" :class="customClass" loading="lazy" @error="handleImageError" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuthorStore } from '~/stores/author'

const props = defineProps<{
  avatar?: string | null
  authorSlug: string
  authorName: string
  customClass?: string
}>()

const authorStore = useAuthorStore()
const imageError = ref(false)
const storeAvatar = ref<string | null>(null)

const customClass = computed(() =>
  props.customClass || 'h-10 w-10 rounded-full bg-gray-100 object-cover'
)

// Fallback
const fallbackAvatar = computed(() =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(props.authorName)}`
)

const avatarUrl = computed(() => {
  if (imageError.value) {
    return fallbackAvatar.value
  }

  // Utiliser l'avatar directement
  if (props.avatar) {
    return props.avatar
  }

  // Si non récupérer depuis le authorStore
  if (storeAvatar.value) {
    return storeAvatar.value
  }

  //  Si aucun avatar n'est trouvé
  return fallbackAvatar.value
})

// Gestion d'erreur
const handleImageError = () => {
  imageError.value = true
}

// Details de l'auteur
onMounted(async () => {
  if (!props.avatar) {
    // Depuis le store
    const cachedAvatar = authorStore.getAuthorAvatar(props.authorSlug)
    if (cachedAvatar) {
      storeAvatar.value = cachedAvatar
    } else {
      // Depuis l'API
      const author = await authorStore.fetchAuthorBySlug(props.authorSlug)
      if (author?.avatar) {
        storeAvatar.value = author.avatar
      }
    }
  }
})
</script>
