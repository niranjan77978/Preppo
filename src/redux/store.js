import { configureStore } from '@reduxjs/toolkit'

// Simple placeholder reducer
const placeholderReducer = (state = {}, action) => {
  return state
}

export const store = configureStore({
  reducer: {
    placeholder: placeholderReducer
  },
})