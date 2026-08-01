export const requestInterceptor = {
  onRequest: (config: any) => config,
  onResponse: (response: any) => response,
  onError: (error: any) => Promise.reject(error)
}
