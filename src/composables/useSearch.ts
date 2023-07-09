import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ResultItem } from '../types/SearchBar'

interface Search {
  loading: Ref<boolean>
  result: Ref<ResultItem[] | null>
  error: Ref<string | null>
  query: (arg: string) => void
}

export function useSearch(searchService: (query: string) => Promise<ResultItem[]>): Search {
  const result = ref<ResultItem[] | null>(null)

  const loading = ref<boolean>(false)
  const error = ref<string>('')

  const query = async (args: string) => {
    loading.value = true
    error.value = ''
    result.value = null
    try {
      result.value = await searchService(args)
    } catch (err) {
      console.log(err)
      error.value = (err as Error).toString()
    } finally {
      loading.value = false
    }
  }

  return { result, loading, error, query }
}
