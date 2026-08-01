import { requestClient } from './client'

export async function uploadFile(url: string, file: File, data?: Record<string, unknown>) {
  const formData = new FormData()
  formData.append('file', file)
  Object.entries(data || {}).forEach(([key, value]) => {
    formData.append(key, String(value))
  })

  return requestClient.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
