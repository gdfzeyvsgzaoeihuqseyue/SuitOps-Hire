<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Articles de blog</h1>
        <p class="mt-4 text-lg leading-8 text-gray-600">
          Découvrez nos derniers articles, conseils et actualités sur le recrutement
        </p>
      </div>

      <!-- Filtres -->
      <div class="mt-8 space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Recherche dans titre et excerpt -->
          <div class="flex-1">
            <input v-model="searchQuery" type="text" placeholder="Rechercher dans les articles..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              @keyup.enter="applyFilters" />
          </div>

          <!-- Tri -->
          <div class="w-full sm:w-64">
            <select v-model="sortBy" @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="date-desc">Plus récents</option>
              <option value="date-asc">Plus anciens</option>
              <option value="alpha-asc">A → Z</option>
              <option value="alpha-desc">Z → A</option>
            </select>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="applyFilters"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
            Rechercher
          </button>
          <button @click="resetFilters"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="blogStore.isLoading" class="text-center mt-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Chargement des articles...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="blogStore.error" class="text-center mt-16 text-red-600">
        <p>{{ blogStore.error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="blogStore.blogs.length === 0" class="text-center mt-16 text-gray-600">
        <p>Aucun article de blog trouvé.</p>
      </div>

      <!-- Articles Grid -->
      <div v-else>
        <!-- Compteur d'articles -->
        <div class="mt-8 text-sm text-gray-600">
          {{ blogStore.totalArticles }} article{{ blogStore.totalArticles > 1 ? 's' : '' }} trouvé{{
            blogStore.totalArticles > 1 ? 's' : '' }}
        </div>

        <div class="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="post in blogStore.blogs" :key="post.id"
            class="flex flex-col items-start bg-white hover:shadow-lg transition-shadow rounded-2xl overflow-hidden border border-gray-100">
            <div class="relative w-full">
              <NuxtLink :to="`/blog/${post.slug}`">
                <img
                  :src="post.imageUrl || `https://placehold.co/600x400/0284c7/FFFFFF/png?text=${encodeURIComponent(post.title)}`"
                  :alt="post.title" class="aspect-[16/9] w-full bg-gray-100 object-cover" loading="lazy" />
              </NuxtLink>
            </div>

            <div class="flex-1 flex flex-col w-full p-6">
              <div class="flex items-center gap-x-4 text-xs flex-wrap">
                <time :datetime="new Date(post.createdAt).toISOString()" class="text-gray-500">
                  {{ formatDate(post.createdAt) }}
                </time>
                <span class="relative z-10 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600">
                  {{ post.category.name }}
                </span>
                <span class="flex items-center gap-1 text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ post.views }}
                </span>
              </div>

              <div class="group relative flex-1">
                <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <NuxtLink :to="`/blog/${post.slug}`">
                    <span class="absolute inset-0"></span>
                    {{ post.title }}
                  </NuxtLink>
                </h3>
                <p class="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                  {{ post.excerpt }}
                </p>
              </div>

              <!-- Tags -->
              <div v-if="post.tags && post.tags.length > 0" class="mt-4 flex flex-wrap gap-2">
                <span v-for="tag in post.tags.slice(0, 3)" :key="tag"
                  class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  #{{ tag }}
                </span>
              </div>

              <!-- Author -->
              <div class="relative mt-6 flex items-center gap-x-3 pt-4 border-t border-gray-100">
                <BlogAuthorAvatar :avatar="post.author.avatar" :author-slug="post.author.slug"
                  :author-name="post.author.name" custom-class="h-10 w-10 rounded-full bg-gray-100 object-cover" />
                <div class="text-sm leading-5">
                  <p class="font-semibold text-gray-900">
                    <a :href="`https://progestionsoft.netlify.app/blog/author/${post.author.slug}`" target="_blank"
                      rel="noopener noreferrer" class="hover:text-primary transition" @click.stop>
                      {{ post.author.name }}
                    </a>
                  </p>
                  <p v-if="post.author.role" class="text-gray-600 text-xs mt-0.5">
                    {{ post.author.role }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="blogStore.totalPages > 1" class="mt-12 flex justify-center gap-2 flex-wrap">
          <button @click="changePage(blogStore.currentPage - 1)" :disabled="blogStore.currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
            Précédent
          </button>

          <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="[
            'px-4 py-2 border rounded-lg transition',
            page === blogStore.currentPage
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 hover:bg-gray-50'
          ]">
            {{ page }}
          </button>

          <button @click="changePage(blogStore.currentPage + 1)"
            :disabled="blogStore.currentPage === blogStore.totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useBlogStore } from '~/stores/blog'

const blogStore = useBlogStore()
const searchQuery = ref('')
const sortBy = ref<'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc'>('date-desc')

// Catégories autorisées
const ALLOWED_CATEGORIES = ['SuitOps', 'Employabilité', 'Général']

onMounted(async () => {
  await blogStore.fetchBlogs({
    page: 1,
    limit: 9,
    categories: ALLOWED_CATEGORIES,
    sortBy: sortBy.value
  })
})

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), 'dd MMM yyyy', { locale: fr })
}

const applyFilters = async () => {
  await blogStore.fetchBlogs({
    page: 1,
    limit: 9,
    categories: ALLOWED_CATEGORIES,
    searchQuery: searchQuery.value || undefined,
    sortBy: sortBy.value
  })
}

const resetFilters = async () => {
  searchQuery.value = ''
  sortBy.value = 'date-desc'
  await blogStore.fetchBlogs({
    page: 1,
    limit: 9,
    categories: ALLOWED_CATEGORIES,
    sortBy: 'date-desc'
  })
}

const changePage = async (page: number) => {
  if (page < 1 || page > blogStore.totalPages) return

  await blogStore.fetchBlogs({
    page,
    limit: 9,
    categories: ALLOWED_CATEGORIES,
    searchQuery: searchQuery.value || undefined,
    sortBy: sortBy.value
  })

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const visiblePages = computed(() => {
  const total = blogStore.totalPages
  const current = blogStore.currentPage
  const pages: number[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push(total)
    }
  }

  return pages
})

// SEO
useHead({
  title: 'Articles et Actualités',
  meta: [
    { name: 'description', content: 'Découvrez nos derniers articles, conseils et actualités sur le recrutement et les ressources humaines' }
  ]
})
</script>
