import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addBill:{},
    editBill:{},
    viewBill:{},
    tabList:[],
    tabIndex:"1",
    prevTabIndex:"0"

}

const reduxSlice = createSlice({
    name: 'bill',
    initialState,
    reducers: {
            addBill:(state,action)=>{
                Object.assign(state.addBill,{[action.payload.tabIndex]:action.payload.data})
            },
            changeAddBill:(state,action)=>{
                Object.assign(state.addBill[action.payload.tabIndex],{[action.payload.name]:action.payload.data})
            },
            editBill:(state,action)=>{
                Object.assign(state.editBill,{[action.payload.tabIndex]:action.payload.data})
            },
            changeEditBill:(state,action)=>{
                Object.assign(state.editBill[action.payload.tabIndex],{[action.payload.name]:action.payload.data})
            },
            viewBill:(state,action)=>{
                Object.assign(state.viewBill,{[action.payload.tabIndex]:action.payload.data})
            },
            addTab:(state,action)=>{
                if( state.tabList.length==0 || !state.tabList?.some((item)=>item.tabIndex==action.payload.tabIndex)){
                    state.tabList.push(action.payload.data);
                }
            },
            removeTab:(state,action)=>{
                delete state?.addBill?.[action.payload.tabIndex];
                delete state?.editBill?.[action.payload.tabIndex];
                delete state?.viewBill?.[action.payload.tabIndex.substring(0, 1).toLowerCase() +action.payload.tabIndex.substring(1)];
                Object.assign(state,{tabList:state.tabList.filter((item)=>item?.tabIndex!=action.payload.tabIndex)})                
            },
            handleTab:(state,action)=>{
                state.tabIndex=action.payload.tabIndex;
                state.prevTabIndex=state.tabIndex;
            }
    },
})

export default reduxSlice.reducer;
export const {  
              addBill,
              editBill,
              changeAddBill,
              changeEditBill,
              viewBill,
              addTab,
              removeTab,
              handleTab  
            } = reduxSlice.actions;