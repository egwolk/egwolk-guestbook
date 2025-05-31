import { userQueryOptions } from '@/lib/api'
import { createFileRoute, Outlet } from '@tanstack/react-router'
// import { userQueryOptions } from '@/lib/api'


const Login = () => {
    return (
        <>
          <div>You gotta login</div>
          <a href="/api/login">Login</a>
        </>
    )
}


const Component = () => {
    const { user } = Route.useRouteContext()
    if (!user) {
      return <Login />
    }

    return <Outlet />
}


// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryCLient = context.queryClient
    try {
      const data = await queryCLient.fetchQuery(userQueryOptions)
      return data
    } catch (e) {
      console.error(e)
      return {user: null}
    }
    // return {user: null} // Simulating no user logged in
  },
  component: Component
})

