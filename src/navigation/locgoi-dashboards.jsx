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
    }
]

export default main
