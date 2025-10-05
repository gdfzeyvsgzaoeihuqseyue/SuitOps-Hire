import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BlogAuthorDetail } from '~/types'

export const useAuthorStore = defineStore('author', () => {
  const authors = ref<Map<string, BlogAuthorDetail>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchAuthorBySlug = async (slug: string): Promise<BlogAuthorDetail | null> => {
    if (authors.value.has(slug)) {
      return authors.value.get(slug)!
    }

    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const response = await fetch(`${config.public.pgsBaseAPI}/blog/author/${slug}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      authors.value.set(slug, data.data)
      return data.data
    } catch (e: any) {
      error.value = 'Erreur lors du chargement de l\'auteur'
      console.error('Error fetching author:', e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const getAuthorAvatar = (authorSlug: string): string | null => {
    const author = authors.value.get(authorSlug)
    return author?.avatar || null
  }

  return {
    authors,
    isLoading,
    error,
    fetchAuthorBySlug,
    getAuthorAvatar
  }
})
