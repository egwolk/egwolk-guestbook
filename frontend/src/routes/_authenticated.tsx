import { createFileRoute, Outlet } from '@tanstack/react-router'
// import { userQueryOptions } from '@/lib/api'


const Login = () => {
    return (
        <div>You gotta login</div>
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
  beforeLoad: async () => {
    // return {user: {name: ""}}
    return {user: null} // Simulating no user logged in
  },
  component: Component
})

