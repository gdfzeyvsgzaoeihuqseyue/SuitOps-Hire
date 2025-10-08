<template>
  <article class="py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="blogStore.isLoading" class="text-center mt-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Chargement de l'article...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="blogStore.error" class="text-center mt-16 text-red-600">
        <p>{{ blogStore.error }}</p>
        <NuxtLink to="/blog" class="mt-4 inline-block text-primary hover:underline">
          Retour aux articles
        </NuxtLink>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!blogStore.currentBlog" class="text-center mt-16 text-gray-600">
        <p>Article non trouvé.</p>
        <NuxtLink to="/blog" class="mt-4 inline-block text-primary hover:underline">
          Retour aux articles
        </NuxtLink>
      </div>

      <!-- Article Content -->
      <div v-else>
        <!-- Back Button -->
        <div class="mb-8">
          <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition">
            <IconArrowLeft class="w-5 h-5" />
            Retour aux articles
          </NuxtLink>
        </div>

        <!-- Header -->
        <header class="relative">
          <div class="text-center">
            <!-- Category Badge -->
            <div class="flex justify-center">
              <span
                class="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {{ blogStore.currentBlog.category.name }}
              </span>
            </div>

            <!-- Title -->
            <h1 class="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {{ blogStore.currentBlog.title }}
            </h1>

            <!-- Excerpt -->
            <p v-if="blogStore.currentBlog.excerpt" class="mt-6 text-xl leading-8 text-gray-600">
              {{ blogStore.currentBlog.excerpt }}
            </p>
          </div>

          <!-- Meta Information -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <!-- Author -->
            <div class="flex items-center gap-2">
              <BlogAuthorAvatar :avatar="blogStore.currentBlog.author.avatar"
                :author-slug="blogStore.currentBlog.author.slug" :author-name="blogStore.currentBlog.author.name"
                custom-class="h-12 w-12 rounded-full bg-gray-50 object-cover" />
              <div class="text-left">
                <a :href="`https://progestionsoft.netlify.app/blog/author/${blogStore.currentBlog.author.slug}`"
                  target="_blank" rel="noopener noreferrer"
                  class="font-semibold text-gray-900 hover:text-primary transition block">
                  {{ blogStore.currentBlog.author.name }}
                </a>
                <p v-if="blogStore.currentBlog.author.role" class="text-xs text-gray-600">
                  {{ blogStore.currentBlog.author.role }}
                </p>
              </div>
            </div>

            <span class="text-gray-300 hidden sm:inline">•</span>

            <!-- Date -->
            <time class="text-gray-600" :datetime="new Date(blogStore.currentBlog.createdAt).toISOString()">
              {{ formatDate(blogStore.currentBlog.createdAt) }}
            </time>

            <span class="text-gray-300 hidden sm:inline">•</span>

            <!-- Reading Time -->
            <span class="flex items-center gap-1 text-gray-600">
              <IconClock class="w-5 h-5" />
              {{ readingTime }} min de lecture
            </span>

            <span class="text-gray-300 hidden sm:inline">•</span>

            <!-- Views -->
            <span class="flex items-center gap-1 text-gray-600">
              <IconEye class="w-5 h-5" />
              {{ blogStore.currentBlog.views }} vue{{ blogStore.currentBlog.views > 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Featured Image -->
          <div class="relative mt-10 sm:mt-12">
            <div class="aspect-[16/9] relative rounded-2xl overflow-hidden">
              <img
                :src="blogStore.currentBlog.imageUrl || `https://placehold.co/600x400/0284c7/FFFFFF/png?text=${encodeURIComponent(blogStore.currentBlog.title)}`"
                :alt="blogStore.currentBlog.title" class="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <!-- Tags -->
        <div v-if="blogStore.currentBlog.tags && blogStore.currentBlog.tags.length > 0"
          class="mt-8 flex flex-wrap gap-2 justify-center">
          <span v-for="tag in blogStore.currentBlog.tags" :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-default">
            #{{ tag }}
          </span>
        </div>

        <!-- Share Buttons -->
        <div class="mt-8 border-y border-gray-200 py-6">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span class="text-sm font-medium text-gray-700">Partager cet article :</span>
            <div class="flex gap-2">
              <!-- Facebook -->
              <button @click="shareOnFacebook"
                class="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                title="Partager sur Facebook">
                <IconBrandFacebook class="w-5 h-5" />
              </button>

              <!-- Twitter -->
              <button @click="shareOnTwitter" class="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition"
                title="Partager sur Twitter">
                <IconBrandX class="w-5 h-5" />
              </button>

              <!-- LinkedIn -->
              <button @click="shareOnLinkedIn"
                class="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
                title="Partager sur LinkedIn">
                <IconBrandLinkedin class="w-5 h-5" />
              </button>

              <!-- Email -->
              <button @click="shareByEmail" class="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition"
                title="Partager par email">
                <IconMail class="w-5 h-5" />
              </button>

              <!-- Copy Link -->
              <button @click="copyLink" class="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                :title="linkCopied ? 'Lien copié!' : 'Copier le lien'">
                <IconCopy v-if="!linkCopied" class="w-5 h-5" />
                <IconCopyCheck v-else class="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>

        <!-- Article Content -->
        <div class="mt-12 prose prose-lg prose-gray max-w-none">
          <div v-html="blogStore.currentBlog.content"></div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useBlogStore } from '~/stores/blog'
import { IconClock, IconEye, IconBrandFacebook, IconBrandLinkedin, IconBrandX, IconMail, IconCopy, IconCopyCheck, IconArrowLeft } from '@tabler/icons-vue'

const blogStore = useBlogStore()
const route = useRoute()
const slug = route.params.slug as string
const linkCopied = ref(false)

const readingTime = computed(() => {
  if (!blogStore.currentBlog) return 0
  return blogStore.calculateReadingTime(blogStore.currentBlog.content)
})

onMounted(async () => {
  if (slug) {
    await blogStore.fetchBlogBySlug(slug)
  }
})

// Mettre à jour le SEO lorsque l'article est chargé
watch(() => blogStore.currentBlog, (newBlog) => {
  if (newBlog) {
    useHead({
      title: `${newBlog.title} - Blog SuitOps`,
      meta: [
        { name: 'description', content: newBlog.excerpt || newBlog.title },
        { property: 'og:title', content: newBlog.title },
        { property: 'og:description', content: newBlog.excerpt || newBlog.title },
        { property: 'og:image', content: newBlog.imageUrl || `https://placehold.co/600x400/0284c7/FFFFFF/png?text=${encodeURIComponent(newBlog.title)}` },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: newBlog.title },
        { name: 'twitter:description', content: newBlog.excerpt || newBlog.title },
        { name: 'twitter:image', content: newBlog.imageUrl || `https://placehold.co/600x400/0284c7/FFFFFF/png?text=${encodeURIComponent(newBlog.title)}` },
      ]
    })
  }
}, { immediate: true })

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr })
}

const getCurrentUrl = () => {
  if (process.client) {
    return window.location.href
  }
  return ''
}

const shareOnFacebook = () => {
  const url = encodeURIComponent(getCurrentUrl())
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400')
}

const shareOnTwitter = () => {
  const url = encodeURIComponent(getCurrentUrl())
  const text = encodeURIComponent(blogStore.currentBlog?.title || '')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400')
}

const shareOnLinkedIn = () => {
  const url = encodeURIComponent(getCurrentUrl())
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400')
}

const shareByEmail = () => {
  const subject = encodeURIComponent(blogStore.currentBlog?.title || '')
  const body = encodeURIComponent(`Je voulais partager cet article avec vous : ${getCurrentUrl()}`)
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(getCurrentUrl())
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose :deep(h2) {
  margin-top: 2em;
  margin-bottom: 1em;
  font-size: 1.5em;
  font-weight: 700;
  color: #111827;
}

.prose :deep(h3) {
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  font-size: 1.25em;
  font-weight: 600;
  color: #111827;
}

.prose :deep(p) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  line-height: 1.75;
}

.prose :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.prose :deep(a:hover) {
  color: #1d4ed8;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose :deep(li) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :deep(img) {
  margin-top: 2em;
  margin-bottom: 2em;
  border-radius: 0.5rem;
}
</style>
