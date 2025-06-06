import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {type QueryClient} from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root
})

function NavBar() {
  return (
    <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>{' '}
        <Link to="/totalMsg" className="[&.active]:font-bold"> {/*for testing*/}
          Total Messages
        </Link>{' '}
        <Link to="/messages" className="[&.active]:font-bold">
          Messages
        </Link>{' '}
        <Link to="/createMessage" className="[&.active]:font-bold">   
          Create Message
        </Link>{' '}
        <Link to="/profile" className="[&.active]:font-bold">   
          profile
        </Link>{' '}
      </div>
  )
}

function Root() {
  return(
    <>
      <NavBar />
      <hr />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Toaster />
    </>
  )
}