import './global.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme/theme-provider'
import { queryClient } from './lib/react-query'
import { QueryClientProvider} from "@tanstack/react-query"

export function App() {
  return (
    <>
      <HelmetProvider>
        <ThemeProvider storageKey='pizzashop=theme' defaultTheme='dark'>
          <Toaster richColors />
          <Helmet titleTemplate='%s | pizza.shop' />

          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </>
  )
}
