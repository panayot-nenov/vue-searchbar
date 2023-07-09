export async function request<T>(resource: RequestInfo | URL): Promise<T> {
  const headers = {
    headers: {
      Accept: 'application/json'
    }
  }
  const response = await fetch(resource, headers)
  if (!response.ok) {
    throw new Error('Request failed: ' + response.status)
  }
  return await response.json()
}
