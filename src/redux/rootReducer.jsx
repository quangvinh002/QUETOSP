import { combineReducers } from 'redux'

import customiseReducer from './customise/customiseReducer'

const rootReducer = combineReducers({
    customise: customiseReducer
})

export default rootReducer
