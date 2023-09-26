import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { ConfigProvider, BackTop } from 'antd'
import { IntlProvider } from 'react-intl'

import AppLocale from '@/languages'
import Router from '@/router/Router'
import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import 'dayjs/locale/vi'

dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(customParseFormat)

const httpLink = createHttpLink({
    uri:
        process.env.REACT_APP_API_URL +
        'graphql' +
        `${localStorage.getItem('@token') ? '/secret' : ''}`
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem('@token')}`
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: { watchQuery: { fetchPolicy: 'no-cache' } }
})

export default function App() {
    // Redux
    const customise = useSelector((state) => state.customise)

    // Lang
    const currentAppLocale = AppLocale[customise.language]

    useEffect(() => {
        document.querySelector('html').setAttribute('lang', customise.language)
    }, [customise])

    return (
        <ApolloProvider client={client}>
            <ConfigProvider
                locale={currentAppLocale.antd}
                direction={customise.direction}>
                <IntlProvider
                    locale={currentAppLocale.locale}
                    messages={currentAppLocale.messages}>
                    <Router />
                    <BackTop />
                </IntlProvider>
            </ConfigProvider>
        </ApolloProvider>
    )
}
