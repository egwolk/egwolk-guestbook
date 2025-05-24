import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
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
        <Link to="/messages" className="[&.active]:font-bold"> {/*for testing*/}
          Messages
        </Link>{' '}
        <Link to="/createMessage" className="[&.active]:font-bold"> {/*for testing*/}
          Create Message
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
    </>
  )
}