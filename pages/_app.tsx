import '../styles/globals.css';
import { Spinner } from '@chakra-ui/react';
import { Raleway, Montserrat } from '@next/font/google';
import {
  Hydrate,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import React from 'react';

import { SessionProvider, useSession } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import SEO from '../next-seo.config';
import { CustomChakraProvider } from '../styles/CustomChakraProvider';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal'],
  variable: '--font-montserrat',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal'],
  variable: '--font-raleway',
});

const AppWrappers = ({ Component, pageProps }: AppProps) => {
  const { loggedIn, handleRefresh, isLoading } = useSession();

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: async (error, query) => {
            //@ts-ignore
            if (error.status === 401) {
              // This will refresh our token automatically if any of our queries don't pass auth
              await handleRefresh();
              if (loggedIn) {
                queryClient.refetchQueries(query.queryKey);
              }
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <main
          className={`${montserrat.variable} ${raleway.variable} relative min-h-screen font-raleway`}
        >
          <DefaultSeo {...SEO} />
          <CustomChakraProvider>
            <ToastProvider>
              {isLoading ? (
                <div className="flex w-full items-center justify-center">
                  <Spinner size="xl" thickness="4px" />
                </div>
              ) : (
                <Component {...pageProps} />
              )}
            </ToastProvider>
          </CustomChakraProvider>
        </main>
      </Hydrate>
    </QueryClientProvider>
  );
};

export default function App(props: AppProps) {
  return (
    <SessionProvider>
      <AppWrappers {...props} />
    </SessionProvider>
  );
}
