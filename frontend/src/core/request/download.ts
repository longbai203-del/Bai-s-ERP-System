import { requestClient } from './client'

export async function downloadFile(url: string, fileName = 'download') {
  const response = await requestClient.get(url, { responseType: 'blob' })
  const blob = response.data as Blob
  const href = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.click()
  window.URL.revokeObjectURL(href)
}
