import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { SkeletonTheme } from 'react-loading-skeleton'

function App() {

  return (
    <>
      <SkeletonTheme baseColor= "#dcd8d2" highlightColor="#f0ece6">
        <RouterProvider router={router} />
      </SkeletonTheme>
    </>
  )
}

export default App
