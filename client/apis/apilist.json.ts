import { OpenAPIV3 } from 'openapi-types'

export type Api = {
  apiServiceId: string
  title: string
  baseURL: OpenAPIV3.ServerObject[]
  description?: string
  category: string[]
  updated?: string
  icon: string
}

export interface Methods {
  get: {
    resData: Api[]
  }
}
