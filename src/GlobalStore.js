import { createGlobalState } from 'react-hooks-global-state'

const initialState = {
    token: localStorage.getItem('@token'),
    userInfo: null,
    isRefetch: true,
    random: null,
    notifyList: null
}

const { useGlobalState } = createGlobalState(initialState)

export default useGlobalState
