import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import store from '../../redux/store'
import Menu from './components/Menu' 
import SimpleFooter from './components/Footer'
import Head from 'next/head'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Menu />
        <Head>
          <title>Awesome Task Manager</title>
        </Head>
        <Component {...pageProps} />
        <SimpleFooter />
      </QueryClientProvider>
    </Provider>
  )
}
