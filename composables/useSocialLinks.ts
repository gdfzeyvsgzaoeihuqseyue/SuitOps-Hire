import { IconBrandLinkedin, IconBrandFacebook, IconBrandYoutube, IconBrandTwitter, IconBrandGithub, IconBrandTiktok } from '@tabler/icons-vue'

const iconMap: Record<string, any> = {
  LinkedIn: IconBrandLinkedin,
  Facebook: IconBrandFacebook,
  Youtube: IconBrandYoutube,
  Twitter: IconBrandTwitter,
  Github: IconBrandGithub,
  TikTok: IconBrandTiktok
}

export const useSocialLinks = async (mediaFilter?: string[]) => {
  const config = useRuntimeConfig()

  const { data, error, pending } = await useFetch<{
    data: { media: string; link: string }[]
  }>(`${config.public.suitipsApiBase}/public/website/footer/links`, {
    key: 'social-links'
  })

  const filteredLinks = computed(() => {
    if (!data.value?.data) return []

    return data.value.data
      .filter((item) => !mediaFilter || mediaFilter.includes(item.media))
      .map((item) => ({
        name: item.media,
        href: item.link,
        icon: iconMap[item.media] || null
      }))
  })

  return {
    filteredLinks,
    error,
    isLoading: pending
  }
}
