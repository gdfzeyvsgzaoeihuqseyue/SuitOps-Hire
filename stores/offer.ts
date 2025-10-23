import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Job, JobsResponse } from '~/types'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref<Job[]>([])
  const selectedDate = ref<Date | null>(null)
  const searchQuery = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentJob = ref<Job | null>(null)

  const filteredJobs = computed(() => {
    return jobs.value
      .filter(job => {
        if (!selectedDate.value) return true 
        return job.createdAt >= selectedDate.value.getTime()
      })
      .filter(job => {
        if (!searchQuery.value) return true
        const query = searchQuery.value.toLowerCase()
        return (
          job.post.toLowerCase().includes(query) ||
          job.company.name.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.skills.toLowerCase().includes(query)
        )
      })
  })

  const fetchJobs = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const config = useRuntimeConfig()
      const response = await fetch(`${config.public.suitopsApiBase}/joboffer/all`)
      const data: JobsResponse = await response.json()
      jobs.value = data.data
    } catch (e) {
      error.value = 'Erreur lors du chargement des offres'
      console.error('Error fetching jobs:', e)
    } finally {
      isLoading.value = false
    }
  }

  const fetchJobById = async (id: string) => {
    isLoading.value = true
    error.value = null
    currentJob.value = null

    try {
      const config = useRuntimeConfig()
      const response = await fetch(`${config.public.suitopsApiBase}/joboffer/${id}`)
      const { data } = await response.json()
      currentJob.value = data
    } catch (e) {
      error.value = 'Erreur lors du chargement de l\'offre'
      console.error('Error fetching job:', e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    jobs,
    selectedDate,
    searchQuery,
    isLoading,
    error,
    currentJob,
    filteredJobs,
    fetchJobs,
    fetchJobById
  }
})