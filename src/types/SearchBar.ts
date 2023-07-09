export interface SearchService {
  url: string
  search(query: string): Promise<ResultItem[]>
  find(id: string | number): Promise<any>
}
export interface ResultItem {
  id: string | number
  text: string
}
