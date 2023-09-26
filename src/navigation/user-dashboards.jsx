import {
    CommandSquare,
    Briefcase,
    Call,
    DeviceMessage,
    ElementPlus,
    Box,
    ArrowUp,
    BackSquare,
    Diagram
} from 'iconsax-react'

const main = [
    {
        header: 'Quản lý'
    },
    {
        id: 'otp',
        title: 'Mời gói cước',
        icon: <Call color="#05753D" variant="Bulk" />,
        navLink: '/admin/otp'
    },
    {
        id: 'khcn',
        title: 'Tra cứu KHCN',
        icon: <DeviceMessage color="#05753D" variant="Bulk" />,
        navLink: '/admin/khcn'
    },
    {
        id: 'refund',
        title: 'Hoàn tiền',
        icon: <BackSquare color="#05753D" variant="Bulk" />,
        navLink: '/admin/refund'
    },
    {
        id: 'upgrade',
        title: 'Nâng cấp',
        icon: <ArrowUp color="#05753D" variant="Bulk" />,
        children: [
            {
                id: '/admin/upgrade',
                title: 'Danh sách nâng cấp',
                navLink: '/admin/upgrade'
            },
            {
                id: 'report-upgrade',
                title: 'Báo cáo nâng cấp',
                navLink: '/admin/report/upgrade'
            }
        ]
    },
    {
        id: 'packs',
        title: 'Danh sách gói cước',
        icon: <CommandSquare color="#05753D" variant="Bulk" />,
        navLink: '/admin/packs'
    },
    {
        id: 'page-layouts',
        title: 'Dữ liệu',
        icon: <Briefcase color="#05753D" variant="Bulk" />,
        children: [
            {
                id: 'boxed- layout',
                title: 'Danh sách thuê bao',
                navLink: '/admin/data/subscriptions'
            }
        ]
    },
    {
        id: 'giahan',
        title: 'Chuyển code',
        icon: <ElementPlus color="#05753D" variant="Bulk" />,
        children: [
            {
                id: 'pack_code/approve',
                title: 'Danh sách duyệt gói',
                navLink: '/admin/pack_code/approve'
            },
            {
                id: 'pack_code/user-revenue',
                title: 'Báo cáo nhân viên',
                navLink: '/admin/pack_code/report-user-revenue'
            }
        ]
    },
    {
        id: 'extend',
        title: 'Gia hạn',
        icon: <Box color="#05753D" variant="Bulk" />,
        children: [
            {
                id: 'extend/approve',
                title: 'Danh sách duyệt gói',
                navLink: '/admin/extend/approve'
            },
            {
                id: 'extend/user-revenue',
                title: 'Báo cáo nhân viên',
                navLink: '/admin/extend/report-user-revenue'
            }
        ]
    },
    {
        id: 'report',
        title: 'Báo cáo',
        icon: <Diagram color="#05753D" variant="Bulk" />,
        children: [
            {
                id: 'report-dt',
                title: 'Báo cáo doanh thu',
                navLink: '/admin/report/dt'
            },
            {
                id: 'logs-report',
                title: 'Báo cáo tra cứu',
                navLink: '/admin/logs-report'
            }
        ]
    }
]

export default main
