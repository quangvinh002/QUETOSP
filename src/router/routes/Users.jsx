import { lazy } from 'react'

const PagesRoutes = [
    {
        path: '/',
        exact: true,
        component: lazy(() => import('@/view/pages/home'))
    },
    {
        path: '/login',
        component: lazy(() => import('@/view/pages/authentication/login'))
    }
]

export default PagesRoutes
