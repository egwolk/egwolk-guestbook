import { hc } from "hono/client"
import type { ApiRoutes } from "@backend/app"
import { queryOptions } from "@tanstack/react-query"
import type { CreateMessage, SelectMessage, EditMessage } from "@backend/sharedTypes"

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getCurrentUser() {
  const res = await api.me.$get()
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await res.json()
  return data
} 

export const userQueryOptions = queryOptions({
    queryKey: ['get-current-user'], 
    queryFn: getCurrentUser,
    staleTime: Infinity
})

export async function getAllMessages() {
  // await new Promise(r => setTimeout(r, 3000)) // Simulate network delay
  const res = await api.messages.$get()
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await res.json()
  return data
} 

export const getAllMessagesQueryOptions = queryOptions({ 
    queryKey: ['get-all-messages'], 
    queryFn: getAllMessages,
    staleTime: 1000 * 60 * 5,
})
export async function getMessage({ id }: { id: number }): Promise<SelectMessage> {
  await new Promise(r => setTimeout(r, 3000)) // Simulate network delay
  const res = await api.messages[":id{[0-9]+}"].$get({
    param: { id: id.toString() }
  })
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await res.json() as { message: SelectMessage }
  return data.message
} 

export function getMessageQueryOptions(id: number) {
  return {
    queryKey: ['get-message', id],
    queryFn: () => getMessage({ id }),
    staleTime: 1000 * 60 * 5,
  }
}


export async function createMessage({ value }: { value: CreateMessage }) {
  await new Promise(r => setTimeout(r, 3000)) // Simulate network delay
  //throw new Error('Server Error') // for testing
  const res = await api.messages.$post({ json: value })
      if (!res.ok) {
        throw new Error('server error')
      }
    const newMessage = await res.json() 
    return newMessage
}

export const  loadingCreateMessageQueryOptions = queryOptions<{message?: CreateMessage}>({
    queryKey: ['loading-create-message'],
    queryFn: async () => {
      return {}
    },
    staleTime: Infinity,
}) 
export async function editMessage({ id, value }: { id: number; value: EditMessage }) {
  await new Promise(r => setTimeout(r, 3000)) // Simulate network delay
  //throw new Error('Server Error') // for testing
  const res = await api.messages[":id{[0-9]+}"].$put({
    param: { id: id.toString() },
    json: value,
  })
  if (!res.ok) {
    throw new Error('Server Error')
  }
  const updatedMessage = await res.json() as SelectMessage
  return updatedMessage
}

export const  loadingEditMessageQueryOptions = queryOptions<{id?: number}>({
    queryKey: ['loading-edit-message'],
    queryFn: async () => {
      return {}
    },
    staleTime: Infinity,
}) 

export async function deleteMessage({ id }: { id: number }) {
  await new Promise(r => setTimeout(r, 3000)) // Simulate network delay
  const res = await api.messages[":id{[0-9]+}"].$delete({ 
    param: { id: id.toString() } 
  })
  if (!res.ok) {
    throw new Error('Server Error')
  }
}