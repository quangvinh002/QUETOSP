import {
    DocumentFilter,
    CommandSquare,
    Briefcase,
    Box1,
    Call,
    BackSquare,
    DeviceMessage,
    Diagram,
    ElementPlus,
    Box,
    ArrowUp,
    CardPos,
    Aave,
    Airdrop
} from 'iconsax-react'

const main = [
    {
        header: 'Quản lý'
    },
    {
        id: 'loc-goi-cuoc-2',
        title: 'Lọc gói cước',
        icon: <Aave color="#05753D" variant="Bulk" />,
        navLink: '/admin/loc-goi-cuoc-2'
    },
    {
        id: 'tra-cuu-doi-tuong',
        title: 'Tra cứu đối tượng',
        icon: <Airdrop color="#05753D" variant="Bulk" />,
        navLink: '/admin/tra-cuu-doi-tuong'
    },
    {
        id: 'otp',
        title: 'Mời gói cước',
        icon: <Call color="#05753D" variant="Bulk" />,
        navLink: '/admin/otp'
    },
    {
        id: 'refund',
        title: 'Hoàn tiền',
        icon: <BackSquare color="#05753D" variant="Bulk" />,
        navLink: '/admin/refund'
    },
    {
        id: 'khcn',
        title: 'Tra cứu KHCN',
        icon: <DeviceMessage color="#05753D" variant="Bulk" />,
        navLink: '/admin/khcn'
    },
    {
        id: 'packs',
        title: 'Danh sách gói cước',
        icon: <CommandSquare color="#05753D" variant="Bulk" />,
        navLink: '/admin/packs'
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
        id: 'data',
        title: 'Dữ liệu',
        icon: <Briefcase color="#05753D" variant="Bulk" />,
        children: [
            {
                id: 'data/upload',
                title: 'Thêm dữ liệu',
                navLink: '/admin/data/upload'
            },
            {
                id: 'boxed- layout',
                title: 'Danh sách thuê bao',
                navLink: '/admin/data/subscriptions'
            }
        ]
    },
    {
        id: 'nangcap',
        title: 'Chuyển code',
        icon: <ElementPlus color="#05753D" variant="Bulk" />,
        children: [
            {
                id: 'pack_code/manage',
                title: 'Quản lý gói',
                navLink: '/admin/pack_code/manage'
            },
            {
                id: 'pack_code/approve',
                title: 'Danh sách duyệt gói',
                navLink: '/admin/pack_code/approve'
            },
            {
                id: 'paydebt/create',
                title: 'Danh sách công nợ',
                navLink: '/admin/paydebt/create'
            },
            {
                id: 'pack_code/remain',
                title: 'Báo cáo tồn',
                navLink: '/admin/pack_code/report-remain'
            },
            {
                id: 'pack_code/revenue',
                title: 'Báo cáo chi nhánh',
                navLink: '/admin/pack_code/report-revenue'
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
                id: 'extend/list',
                title: 'Danh sách gói',
                navLink: '/admin/extend/list'
            },
            // {
            //     id: 'extend/manage',
            //     title: 'Quản lý gói',
            //     navLink: '/admin/extend/manage'
            // },
            {
                id: 'extend/approve',
                title: 'Danh sách duyệt gói',
                navLink: '/admin/extend/approve'
            },
            // {
            //     id: 'extend/remain',
            //     title: 'Báo cáo tồn',
            //     navLink: '/admin/extend/report-remain'
            // },
            {
                id: 'extend/revenue',
                title: 'Báo cáo chi nhánh',
                navLink: '/admin/extend/report-revenue'
            },
            {
                id: 'extend/user-revenue',
                title: 'Báo cáo nhân viên',
                navLink: '/admin/extend/report-user-revenue'
            }
        ]
    },
    {
        id: 'topup',
        title: 'Tiền nạp',
        icon: <CardPos color="#05753D" variant="Bulk" />,
        children: [
            {
                id: 'topup/create',
                title: 'Tạo lệnh tiền nạp',
                navLink: '/admin/topup/create'
            },
            {
                id: 'topup/revenue',
                title: 'Báo cáo tiền nạp',
                navLink: '/admin/topup/report-revenue'
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
            // {
            //     id: 'report-th',
            //     title: 'Báo cáo tiền hoàn',
            //     navLink: '/admin/report/th'
            // },
            {
                id: 'report-hh',
                title: 'Báo cáo cuộc gọi',
                navLink: '/admin/report/call'
            },
            {
                id: 'logs',
                title: 'Báo cáo data',
                navLink: '/admin/data-report'
            },
            {
                id: 'logs-report',
                title: 'Báo cáo tra cứu',
                navLink: '/admin/logs-report'
            }
        ]
    },
    {
        id: 'user',
        title: 'Quản lý',
        icon: <Box1 color="#05753D" variant="Bulk" />,
        children: [
            {
                id: 'user-list',
                title: 'Danh sách nhân viên',
                navLink: '/admin/user/list'
            },
            {
                id: 'branch-list',
                title: 'Danh sách chi nhánh',
                navLink: '/admin/branch/list'
            }
        ]
    }
]

export default main
