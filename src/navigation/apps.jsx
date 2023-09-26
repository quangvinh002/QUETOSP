import { Calendar, Bookmark, Award, Messages1, Shop } from 'iconsax-react'

import IntlMessages from '@/layout/components/lang/IntlMessages'

const apps = [
    {
        header: <IntlMessages id="sidebar-apps" />
    },
    {
        id: 'apps-calendar',
        title: <IntlMessages id="sidebar-apps-calendar" />,
        icon: <Calendar size={18} />,
        navLink: '/apps/calendar'
    },
    {
        id: 'contact',
        title: <IntlMessages id="sidebar-apps-contact" />,
        icon: <Bookmark size={18} />,
        navLink: '/apps/contact'
    },
    {
        id: 'ecommerce',
        title: <IntlMessages id="sidebar-apps-ecommerce" />,
        icon: <Award size={18} />,
        children: [
            {
                id: 'shop',
                title: <IntlMessages id="sidebar-apps-ecommerce-shop" />,
                navLink: '/apps/ecommerce/shop'
            },
            {
                id: 'wishlist',
                title: <IntlMessages id="sidebar-apps-ecommerce-wishlist" />,
                navLink: '/apps/ecommerce/wishlist'
            },
            {
                id: 'product-detail',
                title: (
                    <IntlMessages id="sidebar-apps-ecommerce-product-detail" />
                ),
                navLink: '/apps/ecommerce/product-detail/0'
            },
            {
                id: 'checkout',
                title: <IntlMessages id="sidebar-apps-ecommerce-checkout" />,
                navLink: '/apps/ecommerce/checkout'
            },
            {
                id: 'inventory',
                title: <IntlMessages id="sidebar-apps-ecommerce-inventory" />,
                navLink: '/apps/ecommerce/inventory'
            }
        ]
    }
]

export default apps
