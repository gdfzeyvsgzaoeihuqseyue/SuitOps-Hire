import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost, BlogsResponse, SingleBlogResponse } from '~/types'

export const useBlogStore = defineStore('blog', () => {
  const blogs = ref<BlogPost[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentBlog = ref<BlogPost | null>(null)
  
  // Pagination
  const totalArticles = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const articlesPerPage = ref(9)

  const fetchBlogs = async (options?: {
    page?: number
    limit?: number
    categories?: string[]  // Filtrer par noms de catégories
    authorId?: string
    searchQuery?: string  // Recherche dans title et excerpt
    sortBy?: 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc'
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const params = new URLSearchParams()
      
      if (options?.page) params.append('page', options.page.toString())
      if (options?.limit) params.append('limit', options.limit.toString())
      if (options?.authorId) params.append('authorId', options.authorId)

      const response = await fetch(`${config.public.pgsBaseAPI}/blog/article?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: BlogsResponse = await response.json()
      
      // Filtrage côté client
      let filteredBlogs = [...data.data]
      
      // Filtrer par catégories (obligatoire - seulement les catégories autorisées)
      if (options?.categories && options.categories.length > 0) {
        filteredBlogs = filteredBlogs.filter(blog => 
          blog.category && options.categories?.includes(blog.category.name)
        )
      }
      
      // Filtrer par recherche dans title et excerpt
      if (options?.searchQuery && options.searchQuery.trim()) {
        const query = options.searchQuery.toLowerCase().trim()
        filteredBlogs = filteredBlogs.filter(blog => {
          const titleMatch = blog.title.toLowerCase().includes(query)
          const excerptMatch = blog.excerpt?.toLowerCase().includes(query) || false
          return titleMatch || excerptMatch
        })
      }
      
      // Tri
      if (options?.sortBy) {
        switch (options.sortBy) {
          case 'date-desc':
            filteredBlogs.sort((a, b) => b.createdAt - a.createdAt)
            break
          case 'date-asc':
            filteredBlogs.sort((a, b) => a.createdAt - b.createdAt)
            break
          case 'alpha-asc':
            filteredBlogs.sort((a, b) => a.title.localeCompare(b.title, 'fr'))
            break
          case 'alpha-desc':
            filteredBlogs.sort((a, b) => b.title.localeCompare(a.title, 'fr'))
            break
        }
      }
      
      blogs.value = filteredBlogs
      totalArticles.value = filteredBlogs.length
      currentPage.value = options?.page || 1
      
      // Recalculer le total de pages basé sur les résultats filtrés
      const limit = options?.limit || 9
      totalPages.value = Math.ceil(filteredBlogs.length / limit)
      
    } catch (e: any) {
      error.value = 'Erreur lors du chargement des articles de blog'
      console.error('Error fetching blogs:', e)
    } finally {
      isLoading.value = false
    }
  }

  const fetchBlogBySlug = async (slug: string) => {
    isLoading.value = true
    error.value = null
    currentBlog.value = null

    try {
      const config = useRuntimeConfig()
      const response = await fetch(`${config.public.pgsBaseAPI}/blog/article/${slug}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: SingleBlogResponse = await response.json()
      currentBlog.value = data.data
      
    } catch (e: any) {
      error.value = 'Erreur lors du chargement de l\'article'
      console.error('Error fetching blog by slug:', e)
    } finally {
      isLoading.value = false
    }
  }

  // Calculer le temps de lecture (200 mots par minute)
  const calculateReadingTime = (content: string): number => {
    const strippedContent = content.replace(/(<([^>]+)>)/gi, '')
    const wordCount = strippedContent.split(/\s+/).length
    return Math.ceil(wordCount / 200)
  }

  return {
    blogs,
    isLoading,
    error,
    currentBlog,
    totalArticles,
    currentPage,
    totalPages,
    articlesPerPage,
    fetchBlogs,
    fetchBlogBySlug,
    calculateReadingTime
  }
})
