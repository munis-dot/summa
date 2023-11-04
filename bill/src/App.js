import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import Biller from './components/Biller'
import BillList from './components/BillList'
import Modal from 'react-modal'
import Tab from './components/tab'
import Bill from './components/bill'


Modal.setAppElement('#root');
function App() {


  return (
    <>
    
  <BrowserRouter>
  <Tab/>
  <Routes>
    <Route path='/*' element={<></>}></Route>
    <Route path='/biller/:mode/:id' element={<Biller/>}></Route>
    <Route path='/bill/BillList' element={<BillList/>}></Route>
    <Route path='/view/:id' element={<Bill/>}></Route>
  </Routes>
  </BrowserRouter>
  
  </>
  )
}

export default App