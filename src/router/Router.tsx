import { createBrowserRouter, redirect } from 'react-router-dom';
import { ChatbotView } from '../features';
import { CHATBOT_PATH } from './routes.constant';

const Router = () => {
    return createBrowserRouter(
        [
            {
              id: 'not-found',
              path: '*',
              loader: () => redirect('/'),
              errorElement: <div>Error</div>,
            },
            {
                id: 'root',
                path: '/',
                // Component: Layout,
                errorElement: <div>Error</div>,
                children: [
                    {
                        index: true,
                        id: 'home',
                        path: CHATBOT_PATH,
                        element: <ChatbotView />,
                        HydrateFallback: () => <div>Loading...</div>,
                    },
                ],
            },
        ],
    );
};

export { Router }