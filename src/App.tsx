import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Router } from './router/Router';

const App = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={Router()} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export { App };
