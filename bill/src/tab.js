import React,{useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { useNavigate,Link } from 'react-router-dom';
import { addTab, handleTab,removeTab } from './reduxSlice'

function Tab() {
    const dispatch = useDispatch();
const navigation = useNavigate()
const redux = useSelector(state=>state)
  useEffect(()=>{
    const parts=window.location.pathname.split('/')
    const rdstr = new Date().valueOf();
    if(window.location.pathname === "/"){
        console.log("w")
   
      dispatch(addTab({tabIndex:rdstr,data:{
        name:"New Bill",
        path:`/biller/newBill/${rdstr}`,
        tabIndex:`${rdstr}`
      }}))
      dispatch(handleTab({tabIndex:rdstr}))
      navigation(`/biller/newBill/${rdstr}`)

      return ()=>null;
    }
    else if(redux.bill.tabList.length==0){
        dispatch(addTab({tabIndex:parts?.[parts?.length-1],data:{
            name:parts?.[2],
            path:window.location.pathname,
            tabIndex:parts?.[parts?.length-1]
        }}))
        dispatch(handleTab({tabIndex:parts?.[parts?.length-1]}))
    }
    else{
        dispatch(addTab({tabIndex:parts?.[parts?.length-1],data:{
            name:parts?.[2],
            path:window.location.pathname,
            tabIndex:parts?.[parts?.length-1]
        }}))
        dispatch(handleTab({tabIndex:parts?.[parts?.length-1]}))
    }
  },[window.location.pathname])

// const newBill=()=>{
//     const parts=window.location.pathname.split('/');
//     dispatch(addTab({tabIndex:parts?.[parts.length-1],data:{
//       name:parts?.[2],
//       path:window.location.pathname,
//       tabIndex:parts?.[parts.length-1]
//     }}))
//     dispatch(handleTab({tabIndex:parts?.[parts.length-1]}))
// }

const rmTab = (index,i)=>{
    dispatch(removeTab({tabIndex:index}))
    if(i==0){
        dispatch(handleTab({tabIndex:redux.bill.tabList[1].tabIndex}))
        navigation(redux.bill.tabList[1].path) 
    }
    else{
        dispatch(handleTab({tabIndex:redux.bill.tabList[0].tabIndex}))
        navigation(redux.bill.tabList[0].path)
    }


}

  return (
    <div>
        <ul className="nav nav-tabs">
            {redux?.bill?.tabList?.map((item,i)=>{
                return(
                    <div className="nav-item" >
      <span className={redux.bill.tabIndex==item?.tabIndex ? "nav-link text-success active" : "nav-link text-success"} style={{paddingRight:"30px"}}  onClick={e=>{navigation(item.path);dispatch(handleTab({tabIndex:item.tabIndex}))}}>{item?.name}</span>
     {redux?.bill?.tabList?.length > 1 && <span className='closeIcon' onClick={e=>rmTab(item?.tabIndex,i)}>X</span>}
      
    </div>
                )
            })}
   <li className='nav-item nav-link' title='new bill' onClick={e=>{navigation(`/biller/NewBill/${new Date().valueOf()}`)}}>+</li>
  </ul>
  </div>
  )
}

export default Tab