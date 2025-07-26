<template>
  <article class="py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="blogStore.isLoading" class="text-center mt-16">Chargement de l'article...</div>
      <div v-else-if="blogStore.error" class="text-center mt-16 text-red-600">{{ blogStore.error }}</div>
      <div v-else-if="!blogStore.currentBlog" class="text-center mt-16 text-gray-600">Article non trouvé.</div>

      <div v-else>
        <header class="relative">
          <div class="text-center">
            <div class="flex justify-center">
              <span
                class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                {{ blogStore.currentBlog.object }}
              </span>
            </div>
            <h1 class="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {{ blogStore.currentBlog.title }}
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600"
              v-html="truncateContent(blogStore.currentBlog.content, 200)"></p>
          </div>

          <div class="mt-8 flex items-center justify-center gap-x-4 text-sm leading-6">
            <img
              :src="blogStore.getDiceBearAvatar(blogStore.currentBlog.createdBy.firstname + ' ' + blogStore.currentBlog.createdBy.lastname)"
              alt="" class="h-12 w-12 rounded-full bg-gray-50" />
            <div class="flex-auto">
              <div class="font-semibold text-gray-900">{{ blogStore.currentBlog.createdBy.firstname }} {{
                blogStore.currentBlog.createdBy.lastname }}</div>
              <div class="text-gray-600">{{ blogStore.currentBlog.author }}</div>
            </div>
            <time class="text-gray-500" :datetime="new Date(blogStore.currentBlog.createdAt).toISOString()">
              {{ formatDate(blogStore.currentBlog.createdAt) }}
            </time>
          </div>

          <div class="relative mt-16 sm:mt-20">
            <div class="aspect-[16/9] relative">
              <img :src="blogStore.currentBlog.image.url" :alt="blogStore.currentBlog.title"
                class="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            </div>
          </div>
        </header>

        <div class="mt-16 prose prose-lg prose-primary mx-auto">
          <div v-html="blogStore.currentBlog.content"></div>
        </div>

        <div class="mt-16 border-t border-gray-100 pt-8 flex justify-between">
          <NuxtLink to="/blog" class="text-primary hover:text-secondary flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clip-rule="evenodd" />
            </svg>
            Retour aux articles
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useBlogStore } from '~/stores/blogs'

const blogStore = useBlogStore()
const route = useRoute()
const articleId = parseInt(route.params.id as string)

onMounted(() => {
  if (!isNaN(articleId)) {
    blogStore.fetchBlogById(articleId)
  } else {
    blogStore.error = "ID d'article invalide."
  }
})

// Mettre à jour le SEO lorsque l'article est chargé
watch(() => blogStore.currentBlog, (newBlog) => {
  if (newBlog) {
    useHead({
      title: newBlog.title,
      meta: [{ name: 'description', content: truncateContent(newBlog.content, 160) }]
    })
  }
}, { immediate: true })


const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr })
}

const truncateContent = (content: string, length: number) => {
  const strippedContent = content.replace(/(<([^>]+)>)/gi, "");
  if (strippedContent.length > length) {
    return strippedContent.substring(0, length) + '...';
  }
  return strippedContent;
}
</script>
