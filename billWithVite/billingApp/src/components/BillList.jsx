import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDocs,collection,query,orderBy,where, getFirestore, deleteDoc, Firestore } from "firebase/firestore";
import {db} from './firebase';
import Modal from 'react-modal'
import Bill from './bill';
// import { FirebaseApp } from 'firebase/app';
// import { async } from '@firebase/util';
import { useDispatch } from 'react-redux';
import { viewBill } from './reduxSlice';


Modal.setAppElement('#root');
const BillList = () => {
    const [bills,setBills]=useState([]);
    const [filter,setFilter]=useState([])
    const [search,setSearch]=useState('')
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const currentDate=new Date();
    const [startDate,setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().substring(0, 10)) // Replace with your start date
    const [endDate,setEndDate] =useState(new Date().toISOString().substring(0, 10))
    const [billData,setBillData]=useState();
    const [load,setLoad] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
      console.log(startDate,endDate,new Date(endDate).getDate()+1)
      const today=new Date(endDate)
      const tomorrow = new Date(endDate);
      tomorrow.setDate(today.getDate() + 1);
      console.log(tomorrow.toISOString().substring(0, 10))
        const q = query(collection(db, 'bill') ,where('datetime', '>=', startDate)
        ,where('datetime', '<=', tomorrow.toISOString().substring(0, 10)),orderBy('datetime'),orderBy('id'));
        const getAll=async()=>{
            const querySnapshot = await getDocs(q);
            const newData = [];
            querySnapshot.forEach((doc) => {
                newData.push({ id: doc.id, refId:doc.ref.id, ...doc.data() });
              });
              setBills(newData)
              setFilter(newData);
              console.log(newData)
        }
        getAll();
    },[startDate,endDate,load])

    const filterData = (userInput) => {
      console.log(bills,userInput)
      const filtered = bills.filter((item) =>
      JSON.stringify(item.billData).toLowerCase().includes(userInput.toLowerCase())
      );
      console.log(filtered)
      setFilter(()=>filtered);
    };
  

    const openModal = (bill) => {
      setBillData(()=>bill?.billData)
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
      setBillData('')
    };
  
    const deleteRow = async(id)=>{
      // const dbs=getFirestore();
      // var deleteBill = dbs.collection('bill').where('id','==',id);
      // deleteBill.get().then(function(querySnapshot) {
      //   querySnapshot.forEach(function(doc) {
      //     doc.ref.delete();
      //   });
      // });
//       try{
//           const g = deleteDoc(collection(db,'bill'),where("id","==",id))
//           console.log(g)
//       }
//       catch(e){
// console.log(e)
//       }
const q = query(collection(db, "bill"), where("id", "==", id));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc)=>{
  console.log(doc.ref.id)
  try{
    deleteDoc(doc.ref);
    alert("deleted successfully");
  }
  catch(e){
    console.log(e)
  }
  setLoad(!load);
})
// console.log(await getDocs(querySnapshot))
// Delete all documents in the query results
// await deleteDoc(querySnapshot);
    }
    
    const Edit=(bill)=>{
  
      navigate(`/biller/EditBill/${bill?.id}`,{state:{data:bill}})
    }
    

  return (
    
        <div className="container mt-5">
        <button className='btn bg-primary text-light mb-3'><Link to='/'><h6 className='text-light'>New Sale</h6></Link></button>
          <h1 className="text-center mb-4">Bills</h1>
          <div className="mb-3 d-flex">
            <div className='me-4'>
            <input
              type="text"
              placeholder="Search.."
              className="form-control"
            //   value={searchTerm}
              onChange={(e) =>filterData(e.target.value)}
            />
            </div>
            <div className='d-flex me-4'>
              <label>from</label>
              <input type='date' value={startDate} onChange={e=>setStartDate(e.target.value)} className='form-control'></input>
            </div>
            <div className='d-flex'>
              <label>to</label>
              <input type='date' value={endDate} onChange={e=>setEndDate(e.target.value)} className='form-control'></input>
            </div>
          </div>
          <table className="table table-bordered table-striped text-center">
            <thead className='table-primary'>
              <tr>
                <th>Bill No</th>
                <th>Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Credit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
        {filter?.map((bill) => (
          <tr key={bill.datetime}>
            <td>{bill.id}</td>
            <td>{bill.billData.customerName}</td>
            <td>{(typeof bill.datetime == 'string')?new Date(bill?.datetime).toLocaleString() :bill?.datetime?.toDate().toDateString()}</td>
            <td>{bill.billData.total}</td>
            <td>{bill.billData.credit ? 'yes' : "no"}</td>
            <td>
              <span className='text-primary' style={{cursor:"pointer"}} onClick={e=>{navigate(`/view/ViewBill${bill.id}`);dispatch(viewBill({tabIndex:`viewBill${bill.id}`,data:bill}));}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
</svg></span>
<span className='text-success' style={{cursor:"pointer"}} onClick={e=>Edit(bill)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
</svg></span>
<span className='text-danger' style={{cursor:"pointer"}} onClick={e=>deleteRow(bill?.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
</svg></span>
</td>
          </tr>
        ))
       }
      </tbody>
          </table>
          <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
     {billData && <Bill billData={billData}/>}
      </Modal>
        </div>
      );
    
};

export default BillList;
