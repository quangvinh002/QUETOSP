import { gql } from '@apollo/client'

export const USER = gql`
    query ($id: Int) {
        User(id: $id) {
            id
            name
            email
            phone
            role
            activated
            created_at
            line_call
            branch {
                id
                display_name
            }
        }
    }
`

export const USERS = gql`
    query (
        $page: Int = 1
        $limit: Int = 50
        $branch_id: Int = null
        $role: Int = null
        $user_code: String = null
        $type: Int = null
        $activated: Int = null
    ) {
        Users(
            page: $page
            limit: $limit
            branch_id: $branch_id
            role: $role
            user_code: $user_code
            type: $type
            activated: $activated
        ) {
            data {
                id
                user_code
                name
                email
                phone
                type
                role
                activated
                username
                line_call
                branch {
                    id
                    display_name
                }
            }
            total
        }
    }
`

export const BRANCHES = gql`
    query ($limit: Int = 0) {
        Branches(limit: $limit) {
            id
            name
            total_members
            total_subscriptions
        }
    }
`

export const SEND_OTP_HISTORIES = gql`
    query ($page: Int = 1, $limit: Int = 50) {
        SendOtpHistories(page: $page, limit: $limit) {
            data {
                id
                phone_number
                code
                status
                created_at
                user {
                    name
                }
            }
            total
        }
    }
`

export const REFUND_HISTORIES = gql`
    query (
        $page: Int = 1
        $limit: Int = 50
        $from_date: String
        $to_date: String
        $user_id: Int
        $is_exist: Int
        $phone_number: String
    ) {
        RefundHistoryList(
            page: $page
            limit: $limit
            from_date: $from_date
            to_date: $to_date
            user_id: $user_id
            phone_number: $phone_number
            is_exist: $is_exist
        ) {
            data {
                id
                phone_number
                status
                amount
                channel
                register_channel
                gift_type
                id_tran
                refcode
                is_exist
                is_duplicate
                amount_tran
                amount_discount
                pack {
                    code
                }
                refundAccount {
                    username
                }
                created_at
                user {
                    name
                }
            }
            total
        }
    }
`

export const UPGRADE_HISTORIES = gql`
    query (
        $page: Int = 1
        $limit: Int = 50
        $from_date: String
        $to_date: String
        $status: Int
    ) {
        UpgradeHistoryList(
            page: $page
            limit: $limit
            from_date: $from_date
            to_date: $to_date
            status: $status
        ) {
            data {
                id
                phone_number
                status
                amount
                res_amount
                err_amount
                code
                created_at
                channel
                register_channel
                refund {
                    channel
                    gift_type
                    register_channel
                }
                user_id
                user {
                    name
                }
            }
            total
        }
    }
`

export const CALL_HISTORIES = gql`
    query (
        $page: Int = 1
        $limit: Int = 50
        $from_date: String
        $to_date: String
        $branch_id: Int = null
        $user_id: Int = null
    ) {
        CallHistoryList(
            page: $page
            limit: $limit
            from_date: $from_date
            to_date: $to_date
            branch_id: $branch_id
            user_id: $user_id
        ) {
            count
            created_at
            accountcode
            user_name
            branch_name
            totalDuration
            totalWaitingTime
            disposition
        }
    }
`

export const CTV_USERS = gql`
    query {
        CtvUsers {
            id
            display_name
            email
            phone
            branch_id
        }
    }
`

export const PACKS = gql`
    query {
        Packs(limit: 0) {
            code
            duration
        }
    }
`

export const EXTEND_PACKS = gql`
    query {
        ExtendPackList(limit: 0) {
            code
            revenue
            real_revenue
        }
    }
`

export const ALL_PACKS = gql`
    query {
        Packs(limit: 0) {
            code
        }
    }
`

export const PACKS_PAGING = gql`
    query ($page: Int = 1, $limit: Int = 50, $search: String) {
        Packs(page: $page, limit: $limit, search: $search) {
            data {
                code
                duration
                amount
                price
                revenue
                description
            }

            total
        }
    }
`

export const PACK_CODE_PAGING = gql`
    query (
        $page: Int = 1
        $limit: Int = 50
        $pack_code: String = null
        $from_date: String
        $to_date: String
    ) {
        PackCodeList(
            page: $page
            limit: $limit
            pack_code: $pack_code
            from_date: $from_date
            to_date: $to_date
        ) {
            data {
                id
                pack_code
                amount
                created_at
                branch {
                    display_name
                }
            }
            total
        }

        PackStoreList(page: $page, limit: $limit) {
            data {
                pack_code
                amount
                branch {
                    display_name
                }
            }
            total
        }
    }
`

export const EXTEND_PACK_HISTORY_PAGING = gql`
    query (
        $page: Int = 1
        $limit: Int = 50
        $pack_code: String = null
        $from_date: String
        $to_date: String
    ) {
        ExtendPackHistoryList(
            page: $page
            limit: $limit
            pack_code: $pack_code
            from_date: $from_date
            to_date: $to_date
        ) {
            data {
                id
                pack_code
                amount
                created_at
                branch {
                    display_name
                }
            }
            total
        }

        ExtendPackStoreList(page: $page, limit: $limit) {
            data {
                pack_code
                amount
                branch {
                    display_name
                }
            }
            total
        }
    }
`

export const FILE_UPLOADEDS = gql`
    query ($page: Int = 1, $limit: Int = 10) {
        FileUploadHistories(page: $page, limit: $limit) {
            data {
                id
                file_name
                activated
                total_active_subscriptions
                total_subscriptions
                total_assigns
                created_at
                upload_by_user {
                    name
                }
            }
            total
        }
    }
`

export const FILE_UPLOADED = gql`
    query ($id: Int) {
        FileUploadHistory(id: $id) {
            id
            file_name
            total_assigns
            assigns {
                user_id
            }
        }
    }
`

export const SUBCRIPTIONS = gql`
    query (
        $page: Int = 1
        $limit: Int = 10
        $code: String = ""
        $khcn_code: String = ""
        $assign_status: Int = null
        $status: Int = null
        $phone_type: String = ""
        $register_date: String
        $expired_date: String
        $file_id: Int = null
    ) {
        Subscriptions(
            page: $page
            limit: $limit
            phone_type: $phone_type
            register_date: $register_date
            expired_date: $expired_date
            code: $code
            khcn_code: $khcn_code
            assign_status: $assign_status
            status: $status
            file_id: $file_id
        ) {
            data {
                id
                phone_number
                phone_type
                code
                first_register_date
                first_expired_date
                register_date
                period
                status
                expired_date
                assigned_date
                user_note
                branch {
                    display_name
                }
                assigned_to_user {
                    name
                }
                register_by_user {
                    name
                }
                upload_by_user {
                    name
                }
            }
            total
        }
    }
`

export const GET_RANDOM_SUBCRIPTION = gql`
    query {
        Subscription(isRandom: true) {
            phone_number
            phone_type
            code
            balance
            first_register_date
            first_expired_date
        }
    }
`

export const LOGS = gql`
    query (
        $page: Int = 1
        $limit: Int = 10
        $from_date: String
        $to_date: String
        $user_id: Int
        $branch_id: Int
        $is_exist: Int
    ) {
        Logs(
            page: $page
            limit: $limit
            from_date: $from_date
            to_date: $to_date
            user_id: $user_id
            branch_id: $branch_id
            is_exist: $is_exist
        ) {
            data {
                id
                params
                created_at
                is_exist
                user {
                    id
                    name
                }
                logType {
                    description
                }
            }
            total
        }
    }
`

export const DATA_LOGS = gql`
    query (
        $page: Int = 1
        $limit: Int = 10
        $from_date: String
        $to_date: String
        $user_id: Int
        $branch_id: Int
    ) {
        DataLogs(
            page: $page
            limit: $limit
            from_date: $from_date
            to_date: $to_date
            user_id: $user_id
            branch_id: $branch_id
        ) {
            data {
                id
                phone_number
                created_at
                user {
                    id
                    name
                }
            }
            total
        }
    }
`

export const LOGS_TOTAL = gql`
    query (
        $from_date: String
        $to_date: String
        $user_id: Int
        $branch_id: Int
        $is_exist: Int
    ) {
        LogsTotal(
            from_date: $from_date
            to_date: $to_date
            user_id: $user_id
            branch_id: $branch_id
            is_exist: $is_exist
        ) {
            total_exist
            total_not_exist
            user {
                id
                name
            }
        }
    }
`

export const DATA_LOGS_TOTAL = gql`
    query (
        $from_date: String
        $to_date: String
        $user_id: Int
        $branch_id: Int
    ) {
        DataLogsTotal(
            from_date: $from_date
            to_date: $to_date
            user_id: $user_id
            branch_id: $branch_id
        ) {
            total
            user {
                id
                name
            }
        }
    }
`

export const PACK_CODE_REQUESTS = gql`
    query ($page: Int = 1, $limit: Int = 10) {
        PackCodeRequestList(page: $page, limit: $limit) {
            data {
                id
                phone_number
                pack_code
                status
                type
                created_at
                requestUser {
                    name
                }
                approvedBy {
                    name
                }
            }
            total
        }
    }
`

export const EXTEND_PACK_REQUESTS = gql`
    query (
        $page: Int = 1
        $limit: Int = 10
        $from_date: String
        $to_date: String
    ) {
        ExtendPackRequestList(
            page: $page
            limit: $limit
            from_date: $from_date
            to_date: $to_date
        ) {
            data {
                id
                phone_number
                pack_code
                status
                created_at
                requestUser {
                    name
                }
                approvedBy {
                    name
                }
            }
            total
        }
    }
`

export const PAY_DEBT_REQUESTS = gql`
    query (
        $page: Int = 1
        $limit: Int = 10
        $branch_id: Int = null
        $from_date: String
        $to_date: String
    ) {
        PayDebtRequestList(
            page: $page
            limit: $limit
            branch_id: $branch_id
            from_date: $from_date
            to_date: $to_date
        ) {
            data {
                id
                amount
                status
                created_at
                created_by
                branch {
                    display_name
                }
                user {
                    id
                    name
                }
                approved {
                    name
                }
            }
            total
        }
    }
`

export const TOPUP_REQUESTS = gql`
    query (
        $page: Int = 1
        $limit: Int = 10
        $branch_id: Int = null
        $from_date: String
        $to_date: String
        $channel: Int
    ) {
        TopupRequestList(
            page: $page
            limit: $limit
            branch_id: $branch_id
            from_date: $from_date
            to_date: $to_date
            channel: $channel
        ) {
            data {
                id
                amount
                status
                type
                created_at
                branch {
                    display_name
                }
                requestUser {
                    name
                }
                approvedBy {
                    name
                }
            }
            total
        }
    }
`
