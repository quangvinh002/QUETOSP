import { gql } from '@apollo/client'

export const CREATE_USER = gql`
    mutation (
        $user_code: String
        $name: String!
        $email: String!
        $phone: String
        $line_call: String
        $branch_id: Int
        $type: Int
    ) {
        createUser(
            user_code: $user_code
            name: $name
            email: $email
            phone: $phone
            branch_id: $branch_id
            type: $type
            line_call: $line_call
        ) {
            id
        }
    }
`

export const UPDATE_USER = gql`
    mutation (
        $id: Int!
        $user_code: String
        $name: String
        $password: String
        $phone: String
        $line_call: String
        $branch_id: Int
        $role: Int
        $type: Int
    ) {
        updateUser(
            id: $id
            user_code: $user_code
            name: $name
            password: $password
            phone: $phone
            branch_id: $branch_id
            role: $role
            type: $type
            line_call: $line_call
        ) {
            id
        }
    }
`

export const CHANGE_PASSWORD = gql`
    mutation ($password: String) {
        updateUser(password: $password) {
            id
        }
    }
`

export const TOGGLE_USER = gql`
    mutation ($id: Int!, $activated: Int!) {
        updateUser(id: $id, activated: $activated) {
            id
        }
    }
`

export const RESET_PASSWORD = gql`
    mutation ($id: Int!, $password: String!) {
        updateUser(id: $id, password: $password) {
            id
        }
    }
`

export const CREATE_BRANCH = gql`
    mutation ($name: String!, $total_members: Int) {
        createBranch(name: $name, total_members: $total_members) {
            id
        }
    }
`

export const UPDATE_BRANCH = gql`
    mutation ($id: Int!, $name: String, $total_members: Int) {
        updateBranch(id: $id, name: $name, total_members: $total_members) {
            id
        }
    }
`

export const UPDATE_FILE_UPLOAD = gql`
    mutation ($id: Int!, $activated: Int) {
        updateFileUploadedHistory(id: $id, activated: $activated) {
            id
        }
    }
`

export const UPDATE_SUBSCRIPTION = gql`
    mutation (
        $phone_number: String!
        $code: String!
        $status: Int
        $user_note: String
    ) {
        updateSubscription(
            phone_number: $phone_number
            code: $code
            status: $status
            user_note: $user_note
        ) {
            phone_number
            phone_type
            code
            first_register_date
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
    }
`

export const CREATE_PACK = gql`
    mutation (
        $code: String!
        $duration: Int!
        $amount: Int!
        $price: Int
        $revenue: Int
        $description: String
    ) {
        createPack(
            code: $code
            duration: $duration
            amount: $amount
            price: $price
            revenue: $revenue
            description: $description
        ) {
            code
        }
    }
`

export const UPDATE_PACK = gql`
    mutation (
        $code: String!
        $duration: Int!
        $amount: Int!
        $price: Int
        $revenue: Int
        $description: String
    ) {
        updatePack(
            code: $code
            duration: $duration
            amount: $amount
            price: $price
            revenue: $revenue
            description: $description
        ) {
            code
        }
    }
`

export const CREATE_EXTEND_PACK = gql`
    mutation ($code: String!, $revenue: Int!, $real_revenue: Int!) {
        createExtendPack(
            code: $code
            revenue: $revenue
            real_revenue: $real_revenue
        ) {
            code
        }
    }
`

export const UPDATE_EXTEND_PACK = gql`
    mutation ($code: String!, $revenue: Int!, $real_revenue: Int!) {
        updateExtendPack(
            code: $code
            revenue: $revenue
            real_revenue: $real_revenue
        ) {
            code
        }
    }
`

export const DELETE_EXTEND_PACK = gql`
    mutation ($code: String!) {
        deleteExtendPack(code: $code)
    }
`

export const CREATE_FILE_UPLOAD = gql`
    mutation (
        $file_name: String!
        $list: [Subscription!]!
        $divideRate: [BranchInputType]
    ) {
        createFileUploadedHistory(
            file_name: $file_name
            list: $list
            divide_rate: $divideRate
        ) {
            id
            duplicateDatas
        }
    }
`

export const DIVIDE_SUBCRIPTIONS = gql`
    mutation ($assign_to_users: Int!, $list: [String!]!) {
        divideSubscriptions(assign_to_users: $assign_to_users, list: $list) {
            id
        }
    }
`

export const DIVIDE_SUBCRIPTIONS_TO_USERS = gql`
    mutation ($fileId: Int!, $list: [Int!]!) {
        divideFileToUsers(file_id: $fileId, list: $list) {
            id
        }
    }
`

export const DELETE_USERS = gql`
    mutation ($ids: [Int!]!) {
        deleteUsers(ids: $ids)
    }
`

export const DELETE_BRANCHES = gql`
    mutation ($ids: [Int!]!) {
        deleteBranches(ids: $ids)
    }
`

export const DELETE_FILE_UPLOAD = gql`
    mutation ($id: Int!) {
        deleteFileUploadedHistory(id: $id)
    }
`

export const CREATE_PACK_CODE = gql`
    mutation ($pack_code: String!, $amount: Int!, $date: String) {
        createPackCode(pack_code: $pack_code, amount: $amount, date: $date) {
            pack_code
        }
    }
`

export const UPDATE_PACK_CODE = gql`
    mutation (
        $pack_code: String!
        $amount: Int!
        $branch_id: Int!
        $date: String
    ) {
        updatePackCode(
            pack_code: $pack_code
            amount: $amount
            branch_id: $branch_id
            date: $date
        ) {
            pack_code
        }
    }
`

export const CREATE_EXTEND_PACK_HISTORY = gql`
    mutation ($pack_code: String!, $amount: Int!, $date: String) {
        createExtendPackHistory(
            pack_code: $pack_code
            amount: $amount
            date: $date
        ) {
            pack_code
        }
    }
`

export const UPDATE_EXTEND_PACK_HISTORY = gql`
    mutation (
        $pack_code: String!
        $amount: Int!
        $branch_id: Int!
        $date: String
    ) {
        updateExtendPackHistory(
            pack_code: $pack_code
            amount: $amount
            branch_id: $branch_id
            date: $date
        ) {
            pack_code
        }
    }
`

export const CREATE_PACK_REQUEST = gql`
    mutation ($pack_code: String!, $type: Int!, $phone_number: String!) {
        createPackRequest(
            pack_code: $pack_code
            type: $type
            phone_number: $phone_number
        ) {
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
    }
`

export const CREATE_EXTEND_REQUEST = gql`
    mutation ($pack_code: String!, $phone_number: String!) {
        createExtendPackRequest(
            pack_code: $pack_code
            phone_number: $phone_number
        ) {
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
    }
`

export const UPDATE_PACK_REQUEST = gql`
    mutation ($id: Int!, $status: Int!) {
        updatePackRequest(id: $id, status: $status) {
            pack_code
        }
    }
`

export const UPDATE_EXTEND_REQUEST = gql`
    mutation ($id: Int!, $status: Int!) {
        updateExtendPackRequest(id: $id, status: $status) {
            pack_code
        }
    }
`

export const DELETE_PACK_REQUESTS = gql`
    mutation ($ids: [Int!]!) {
        deletePackRequest(ids: $ids)
    }
`

export const DELETE_EXTEND_REQUESTS = gql`
    mutation ($ids: [Int!]!) {
        deleteExtendPackRequest(ids: $ids)
    }
`

export const CREATE_PAY_DEBT = gql`
    mutation ($amount: Int!, $created_at: String) {
        createPayDebtRequest(amount: $amount, created_at: $created_at) {
            id
        }
    }
`

export const UPDATE_PAY_DEBT = gql`
    mutation ($id: Int!, $status: Int!) {
        updatePayDebtRequest(id: $id, status: $status) {
            id
        }
    }
`

export const DELETE_PAY_DEBT = gql`
    mutation ($ids: [Int!]!) {
        deletePayDebtRequest(ids: $ids)
    }
`

export const CREATE_TOPUP = gql`
    mutation (
        $amount: Int!
        $type: Int!
        $branch_id: Int!
        $created_at: String!
    ) {
        createTopupRequest(
            amount: $amount
            type: $type
            branch_id: $branch_id
            created_at: $created_at
        ) {
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
    }
`

export const UPDATE_TOPUP = gql`
    mutation ($id: Int!, $status: Int!) {
        updateTopupRequest(id: $id, status: $status) {
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
    }
`

export const DELETE_TOPUP = gql`
    mutation ($ids: [Int!]!) {
        deleteTopupRequest(ids: $ids)
    }
`

export const CREATE_UPGRADE_HISTORY = gql`
    mutation (
        $code: String!
        $phone_number: String!
        $register_channel: Int
        $gift_type: Int = 0
        $res_amount: Int = 0
        $err_amount: Int = 0
    ) {
        createUpgradeHistory(
            code: $code
            phone_number: $phone_number
            register_channel: $register_channel
            gift_type: $gift_type
            res_amount: $res_amount
            err_amount: $err_amount
        ) {
            id
            phone_number
            status
            amount
            channel
            refund {
                register_channel
                gift_type
            }
            res_amount
            err_amount
            code
            created_at
            user {
                name
            }
        }
    }
`

export const UPDATE_UPGRADE_HISTORY = gql`
    mutation (
        $id: Int!
        $gift_type: Int = 0
        $res_amount: Int = 0
        $err_amount: Int = 0
        $register_channel: String
    ) {
        updateUpgradeHistory(
            id: $id
            gift_type: $gift_type
            res_amount: $res_amount
            err_amount: $err_amount
            register_channel: $register_channel
        ) {
            id
            phone_number
            status
            amount
            channel
            refund {
                gift_type
            }
            res_amount
            err_amount
            code
            created_at
            user {
                name
            }
        }
    }
`

export const UPDATE_UPGRADE_HISTORY_STATUS = gql`
    mutation ($id: Int!, $status: Int!) {
        updateUpgradeHistory(id: $id, status: $status) {
            id
            phone_number
            status
            amount
            channel
            res_amount
            code
            created_at
            user {
                name
            }
        }
    }
`

export const DELETE_PACK = gql`
    mutation ($code: String!) {
        deletePack(code: $code)
    }
`

export const DELETE_UPGRADE_HISTORY = gql`
    mutation ($id: Int!) {
        deleteUpgradeHistory(id: $id)
    }
`

export const UPLOAD_FILE_UPGRADE = gql`
    mutation ($list: [UpgradeHistoryInputType]!, $channel: String!) {
        uploadUpgradeFile(list: $list, channel: $channel)
    }
`

export const UPLOAD_FILE_EXTEND = gql`
    mutation (
        $successData: [UpgradeHistoryInputType]!
        $errorData: [UpgradeHistoryInputType]!
    ) {
        uploadExtendFile(successData: $successData, errorData: $errorData)
    }
`
