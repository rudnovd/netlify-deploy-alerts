export interface Alert {
  id: string
  event: string
  target: string
  user: string
  text: string
  site: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
}

type Provider = 'Telegram'

export interface Site {
  id: string
  url: string
  user: string
  enabled: boolean
}

export interface Target {
  id: string
  user: string
  provider: Provider
  target: string
  confirmed: boolean
  created_at: string
  meta: string
}

export interface FetchError {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  stack: string
}
