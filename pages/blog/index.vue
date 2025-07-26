<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blogs</h1>
        <p class="mt-4 text-lg leading-8 text-gray-600">
          Découvrez nos derniers articles, conseils et actualités sur le recrutement
        </p>
      </div>

      <div v-if="blogStore.isLoading" class="text-center mt-16">Chargement des articles...</div>
      <div v-else-if="blogStore.error" class="text-center mt-16 text-red-600">{{ blogStore.error }}</div>
      <div v-else-if="blogStore.blogs.length === 0" class="text-center mt-16 text-gray-600">Aucun article de blog trouvé.</div>
      <div v-else class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="post in blogStore.blogs" :key="post.id" class="flex flex-col items-start">
          <div class="relative w-full">
            <img
              :src="post.image.url"
              :alt="post.title"
              class="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
            />
            <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
          </div>
          <div class="max-w-xl">
            <div class="mt-8 flex items-center gap-x-4 text-xs">
              <time :datetime="new Date(post.createdAt).toISOString()" class="text-gray-500">{{ formatDate(post.createdAt) }}</time>
              <span
                class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
              >{{ post.object }}</span>
            </div>
            <div class="group relative">
              <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <NuxtLink :to="`/blog/${post.id}/${encodeURIComponent(post.title.toLowerCase().replace(/\s+/g, '-'))}`">
                  <span class="absolute inset-0"></span>
                  {{ post.title }}
                </NuxtLink>
              </h3>
              <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600" v-html="truncateContent(post.content, 150)"></p>
            </div>
            <div class="relative mt-8 flex items-center gap-x-4">
              <img :src="blogStore.getDiceBearAvatar(post.author)" alt="" class="h-10 w-10 rounded-full bg-gray-100" />
              <div class="text-sm leading-6">
                <p class="font-semibold text-gray-900">
                  <span>
                    <span class="absolute inset-0"></span>
                    {{ post.createdBy.firstname }} {{ post.createdBy.lastname }}
                  </span>
                </p>
                <p class="text-gray-600">{{ post.author }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useBlogStore } from '~/stores/blogs' 

const blogStore = useBlogStore()

onMounted(() => {
  blogStore.fetchBlogs()
})

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr })
}

const truncateContent = (content: string, length: number) => {
  // Supprime les balises HTML pour un texte brut avant de tronquer
  const strippedContent = content.replace(/(<([^>]+)>)/gi, "");
  if (strippedContent.length > length) {
    return strippedContent.substring(0, length) + '...';
  }
  return strippedContent;
}

// SEO
useHead({
  title: 'Blog',
  meta: [{ name: 'description', content: 'Découvrez nos derniers articles, conseils et actualités sur le recrutement' }]
})
</script>
