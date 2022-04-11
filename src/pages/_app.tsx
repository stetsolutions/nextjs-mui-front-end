import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'
import * as React from 'react'

import theme from '../config/theme'
import { LayoutProvider } from '../contexts/Layout'
import { UserProvider } from '../contexts/User'
import Layout from '../layout/Layout'
import createEmotionCache from '../utilities/cache/emotion'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const exclude = ['/access', '/change', '/reset', '/verify']

export default function MyApp (props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <LayoutProvider exclude={exclude}>
            <SnackbarProvider maxSnack={3}>
              <CssBaseline />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SnackbarProvider>
          </LayoutProvider>
        </ThemeProvider>
      </UserProvider>
    </CacheProvider>
  )
}
