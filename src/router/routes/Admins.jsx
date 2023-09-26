import { lazy } from 'react'

const CustomRoutes = [
    {
        path: '/admin/loc-danh-sach-het-han',
        component: lazy(() => import('@/view/tai-phat/ExpireFilter')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/loc-goi-cuoc',
        component: lazy(() => import('@/view/tai-phat/PackFilter')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/loc-goi-cuoc-2',
        component: lazy(() => import('@/view/tai-phat/PackFilter2')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/tra-cuu-doi-tuong',
        component: lazy(() => import('@/view/tai-phat/SearchKHCN')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/otp',
        component: lazy(() => import('@/view/tai-phat/Otp')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/refund',
        component: lazy(() => import('@/view/tai-phat/Refund')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/upgrade',
        component: lazy(() => import('@/view/tai-phat/Upgrade')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/khcn',
        component: lazy(() => import('@/view/tai-phat/Khcn')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/packs',
        component: lazy(() => import('@/view/tai-phat/Packs')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/data/upload',
        component: lazy(() => import('@/view/tai-phat/Data')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/pack_code/manage',
        component: lazy(() => import('@/view/tai-phat/PackCode')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/pack_code/approve',
        component: lazy(() => import('@/view/tai-phat/PackCode/Approve')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/paydebt/create',
        component: lazy(() =>
            import('@/view/tai-phat/PackCode/PayDebtRequest')
        ),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/pack_code/report-remain',
        component: lazy(() => import('@/view/tai-phat/PackCode/ReportRemain')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/pack_code/report-admin',
        component: lazy(() =>
            import('@/view/tai-phat/PackCode/ReportAdminInput')
        ),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/pack_code/report-revenue',
        component: lazy(() => import('@/view/tai-phat/PackCode/ReportRevenue')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/pack_code/report-user-revenue',
        component: lazy(() =>
            import('@/view/tai-phat/PackCode/ReportUserRevenue')
        ),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/extend/manage',
        component: lazy(() => import('@/view/tai-phat/Extend')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/extend/approve',
        component: lazy(() => import('@/view/tai-phat/Extend/Approve')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/extend/report-remain',
        component: lazy(() => import('@/view/tai-phat/Extend/ReportRemain')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/extend/report-admin',
        component: lazy(() =>
            import('@/view/tai-phat/Extend/ReportAdminInput')
        ),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/extend/report-revenue',
        component: lazy(() => import('@/view/tai-phat/Extend/ReportRevenue')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/extend/list',
        component: lazy(() => import('@/view/tai-phat/Extend/List')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/extend/report-user-revenue',
        component: lazy(() =>
            import('@/view/tai-phat/Extend/ReportUserRevenue')
        ),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/data/subscriptions',
        component: lazy(() => import('@/view/tai-phat/Data/Subscriptions')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/user/list',
        component: lazy(() => import('@/view/tai-phat/User/UserList')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/branch/list',
        component: lazy(() => import('@/view/tai-phat/User/BranchList')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/logs',
        component: lazy(() => import('@/view/tai-phat/Logs')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/logs-report',
        component: lazy(() => import('@/view/tai-phat/KHCNReport')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/data-report',
        component: lazy(() => import('@/view/tai-phat/DataReport')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/report/dt',
        component: lazy(() => import('@/view/tai-phat/ReportTotalRevenue')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/report/call',
        component: lazy(() => import('@/view/tai-phat/ReportCall')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/report/cg',
        component: lazy(() => import('@/view/tai-phat/Logs')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/report/th',
        component: lazy(() => import('@/view/tai-phat/ReportRefund')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/report/upgrade',
        component: lazy(() => import('@/view/tai-phat/Upgrade/Report')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/topup/create',
        component: lazy(() => import('@/view/tai-phat/Topup/Create')),
        layout: 'VerticalLayout'
    },
    {
        path: '/admin/topup/report-revenue',
        component: lazy(() => import('@/view/tai-phat/Topup/Report')),
        layout: 'VerticalLayout'
    }
]

const PagesRoutes = [
    ...CustomRoutes,
    {
        path: '/admin/dashboard',
        component: lazy(() => import('@/view/admin/dashboard/analytics')),
        layout: 'VerticalLayout'
    },
    // PAGES
    {
        path: '/pages/blank-page',
        component: lazy(() => import('@/view/pages/blank')),
        layout: 'VerticalLayout'
    },
    {
        path: '/error-403',
        component: lazy(() => import('@/view/pages/errors/403')),
        layout: 'FullLayout'
    },
    {
        path: '/error-404',
        component: lazy(() => import('@/view/pages/errors/404')),
        layout: 'FullLayout'
    },
    {
        path: '/error-500',
        component: lazy(() => import('@/view/pages/errors/500')),
        layout: 'FullLayout'
    },
    {
        path: '/error-502',
        component: lazy(() => import('@/view/pages/errors/502')),
        layout: 'FullLayout'
    },
    {
        path: '/error-503',
        component: lazy(() => import('@/view/pages/errors/503')),
        layout: 'FullLayout'
    },
    {
        path: '/coming-soon',
        component: lazy(() => import('@/view/pages/errors/coming-soon')),
        layout: 'FullLayout'
    },
    {
        path: '/maintenance',
        component: lazy(() => import('@/view/pages/errors/maintenance')),
        layout: 'FullLayout'
    },
    {
        path: '/pages/profile/personel-information',
        component: lazy(() => import('@/view/pages/profile')),
        layout: 'VerticalLayout'
    },
    {
        path: '/pages/profile/notifications',
        component: lazy(() => import('@/view/pages/profile')),
        layout: 'VerticalLayout'
    },
    {
        path: '/pages/profile/activity',
        component: lazy(() => import('@/view/pages/profile')),
        layout: 'VerticalLayout'
    },
    {
        path: '/pages/profile/security',
        component: lazy(() => import('@/view/pages/profile')),
        layout: 'VerticalLayout'
    },
    {
        path: '/pages/profile/password-change',
        component: lazy(() => import('@/view/pages/profile')),
        layout: 'VerticalLayout'
    },
    {
        path: '/pages/profile/connect-with-social',
        component: lazy(() => import('@/view/pages/profile')),
        layout: 'VerticalLayout'
    }
]

export default PagesRoutes
