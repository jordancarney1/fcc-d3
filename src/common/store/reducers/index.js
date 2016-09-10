import { combineReducers } from 'redux'
import { REQUEST_DATA, RECEIVE_DATA } from '../actions'

const store = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_DATA:
      return {
        ...state,
        isFetching: true,
        [action.component]: {
          ...state[action.component],
        }
      }
    case RECEIVE_DATA:
      return {
        ...state,
        isFetching: false,
        [action.component]: {
          ...state[action.component],
          data: action.data
        }
      }
    default:
      return state
  }
}

export default combineReducers({
  store
})
