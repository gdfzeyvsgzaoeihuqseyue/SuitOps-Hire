import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogAuthor, BlogImage, BlogPost, BlogsResponse } from '~/types/blog'

export const useBlogStore = defineStore('blog', () => {
  const blogs = ref<BlogPost[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentBlog = ref<BlogPost | null>(null)

  const fetchBlogs = async () => {
    isLoading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const response = await fetch(`${config.public.suitipsApiBase}/public/blog/post/all`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: BlogsResponse = await response.json()
      blogs.value = data.data
    } catch (e: any) {
      error.value = 'Erreur lors du chargement des articles de blog'
      console.error('Error fetching blogs:', e)
    } finally {
      isLoading.value = false
    }
  }

  const fetchBlogById = async (id: number) => {
    isLoading.value = true
    error.value = null
    currentBlog.value = null

    try {
      const config = useRuntimeConfig()
      const response = await fetch(`${config.public.suitipsApiBase}/public/blog/post/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json()
      currentBlog.value = data
    } catch (e: any) {
      error.value = 'Erreur lors du chargement de l\'article'
      console.error('Error fetching blog by ID:', e)
    } finally {
      isLoading.value = false
    }
  }

  // Fonction utilitaire pour générer l'avatar DiceBear
  const getDiceBearAvatar = (name: string) => {
    const seed = name.replace(/\s/g, ''); 
    return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
  };

  return {
    blogs,
    isLoading,
    error,
    currentBlog,
    fetchBlogs,
    fetchBlogById,
    getDiceBearAvatar
  }
})