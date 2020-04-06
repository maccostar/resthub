import { OpenAPIV3 } from 'openapi-types'
// import apilist from '~/static/apilist.json'
// export type Api = typeof apilist[0]

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
