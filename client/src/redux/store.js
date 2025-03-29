
import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './authApi'
import { userApi } from './userApi'
import { eventApi } from './eventApi'
import { bookingApi } from './bookingApi'

const store = configureStore({
reducer:{
    [authApi.reducerPath] : authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
},
middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,userApi.middleware,eventApi.middleware,bookingApi.middleware)

})


export default store