import {configureStore } from '@reduxjs/toolkit';
import reduxSlice from './reduxSlice';


const store = configureStore({
    reducer:{
      bill:reduxSlice
    }
})

export default store
export const reduxState = ()=>{
    let redux = store.getState()
    return redux
}