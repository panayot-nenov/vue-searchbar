import type { SearchService, ResultItem } from '../types/SearchBar'
import { request } from '../utils/request'

interface OSMItem {
  id: number
  name: string
  icon: string
  geometry: { type: string; coordinates: [number, number] }
}
export const geoSearch: SearchService = {
  url: 'https://nominatim.openstreetmap.org',
  async search(searchTerm: string): Promise<ResultItem[]> {
    const url = `${this.url}/search?q=${searchTerm}&limit=20&format=json`
    const response = await request<any>(url)
    return [...response]
      .filter((item) => item.osm_type === 'node')
      .map((item) => {
        return {
          text: `${item.display_name}`,
          id: `${item.osm_id}`
        }
      })
  },
  async find(id: string): Promise<OSMItem> {
    const url = `${this.url}/details?osmtype=N&format=json&osmid=${id}`
    const response = await request<any>(url)
    return {
      id: response.osm_id,
      name: response.localname,
      icon: response.icon,
      geometry: { ...response.geometry }
    }
  }
}
export const userSearch: SearchService = {
  url: 'https://jsonplaceholder.typicode.com/users',
  async search(searchTerm: string): Promise<ResultItem[]> {
    const url = `${this.url}`
    const response = await request<any>(url)
    return [...response]
      .filter((item) => item.name.toLocaleLowerCase().includes(searchTerm))
      .map((item, idx) => {
        return {
          text: `${item.name}`,
          id: `${item.id}`
        }
      })
  },
  async find(id: string) {
    const url = `${this.url}/${id}`
    const response = await request(url)
    return response
  }
}
export const todoSearch: SearchService = {
  url: 'https://jsonplaceholder.typicode.com/todos',
  async search(searchTerm: string): Promise<ResultItem[]> {
    const url = `${this.url}`
    const response = await request<any>(url)
    return [...response]
      .filter((item) => {
        return item.title.toLocaleLowerCase().includes(searchTerm)
      })
      .map((item, idx) => {
        return {
          text: `${item.title}`,
          id: `${item.id}`
        }
      })
      .slice(0, 100)
  },
  async find(id: string) {
    const url = `${this.url}/${id}`
    const response = await request(url)
    return response
  }
}
