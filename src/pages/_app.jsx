import { useEffect, useState } from 'react';
import '../index.css';
import 'focus-visible';
import { DefaultSeo } from 'next-seo';
import config from '../config';
import { SpinnerProvider } from '../context/SpinnerContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from 'react-toast-notifications';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

import Navbar from '@/components/Navbar';
import {

  QueryClient,
  QueryClientProvider,
} from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  });

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }));
    };

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }));
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router.events]);

  return (
    <>
      <div
        style={{
          position: 'relative',
        }}
        className="bg-slate-100 relative isolate min-h-screen min-w-screen"
      >
    <img
      src="/bg-desktop.jpg"
      alt=""
      className="fixed inset-0 min-w-full min-h-screen w-auto h-auto -z-10 lg:block hidden"
    />
       <img
      src="/bg-mobile.jpg"
      alt=""
      className="fixed inset-0 min-w-full min-h-screen w-auto h-auto -z-10 lg:hidden block"
    />
           <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        zIndex: '-1',
      }}
    ></div>
        <QueryClientProvider client={queryClient}>
            <SpinnerProvider>
              <ToastProvider autoDismiss autoDismissTimeout={2000}>
              <AuthProvider>
                <div className="font-primary break-all">
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: '#000',
                        color: '#fff',
                        zIndex: 999999999999999,
                      },
                      iconTheme: {
                        primary: '#0ea5e9',
                        secondary: '#fff',
                      },
                    }}
                  />
                </div>

                <Navbar />
                <DefaultSeo {...config} />
                <Component {...pageProps} />
                </AuthProvider>
              </ToastProvider>
            </SpinnerProvider>

        </QueryClientProvider>
      </div>
    </>
  );
}

export default MyApp;
