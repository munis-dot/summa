import React,{useEffect, useRef} from 'react';
import ReactToPrint from "react-to-print";
// import logo from '../src/logo.jpg'
import '../styles/bill.css'
// import andal from '../src/andal.jpg'
import generatePDF from 'react-to-pdf'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
function Bill(props) {
  const ref=useRef(null)
  const redux = useSelector(state=>state)
  const tabIndex=redux.bill.tabIndex.substring(0, 1).toLowerCase() + redux.bill.tabIndex.substring(1);
  console.log(redux.bill.viewBill?.[tabIndex],tabIndex)
  const navigation =useNavigate()
 
  const billData = props?.billData ? props?.billData : redux.bill.viewBill?.[tabIndex]?.billData;
  
  const calculateTotal = () => {
    return billData?.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  function numberToWords(number) {
    const ones = [
      "", "one", "two", "three", "four", "five",
      "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "thirteen", "fourteen", "fifteen",
      "sixteen", "seventeen", "eighteen", "nineteen"
    ];
  
    const tens = [
      "", "", "twenty", "thirty", "forty", "fifty",
      "sixty", "seventy", "eighty", "ninety"
    ];
  
    const scales = ["", "thousand", "million", "billion", "trillion"];
  
    function convertChunk(number) {
      if (number === 0) return "zero";
      
      let words = "";
      
      if (number >= 100) {
        words += ones[Math.floor(number / 100)] + " hundred";
        number %= 100;
        if (number > 0) {
          words += " and ";
        }
      }
      
      if (number >= 20) {
        words += tens[Math.floor(number / 10)];
        number %= 10;
        if (number > 0) {
          words += " ";
        }
      }
      
      if (number > 0) {
        words += ones[number];
      }
      
      return words.trim();
    }
  
    if (number === 0) return "zero";
  
    let words = "";
    let chunkCount = 0;
  
    while (number > 0) {
      if (number % 1000 !== 0) {
        let chunkWords = convertChunk(number % 1000);
        if (chunkCount > 0) {
          chunkWords += " " + scales[chunkCount];
        }
        words = chunkWords + " " + words;
      }
      number = Math.floor(number / 1000);
      chunkCount++;
    }
  
    return words.trim();
  }
  

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
  
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
  
    return `${day}/${month}/${year} ${hours}:${minutes} ${amOrPm}`;
  }


  // Example usage:
  const amountInWords = numberToWords(1234567);
  console.log(amountInWords); // Outputs: "one million two hundred thirty-four thousand five hundred sixty-seven"
  

  // const setFileName = () => {
  //   const fileName = `${billData.billData?.billNumber}-${billData.billData?.customerName}.pdf`;
  //   return fileName;
  // };
  return (
    <div>
      {/* { redux.bill.viewBill?.[tabIndex] && <div className='editBtn container'>
      <button className='btn bg-primary text-light mb-3' onClick={e=>navigation(`/biller/EditBill/${billData?.billNumber}`,{state:{data:redux.bill.viewBill?.[tabIndex]}})}><h6 className='text-light'>Edit</h6></button>
      </div>} */}
        <div className="container bill" ref={ref}>
          <div className="row">
            <div className="col-2 mt-1">
            <img src="/andal.jpg" alt="logo" width="150px" height="200px" />

            </div>
            <div className="col-8 mt-1 from-address d-flex align-items-center flex-column">
              <h6 style={{fontSize:"35px"}}>SRI TIP TOP FOOTWEAR</h6>
              <p style={{fontSize:"17px"}}>45 B3, Noorullah Mall, Santhosh theatre Opposite</p>
              <p>phone: 7639642203 , 9043787626 </p>
              <p>Email: tiptopfancystore@gmail.com</p>
              <p>GSTIN: 33AQPPA4188C1Z1</p>
              <div className="row" style={{marginTop:"10px"}}>
            <div className="d-flex justify-content-center">
              <p className="h6">Estimate</p>
            </div>
            <div className="d-flex justify-content-center">
              <p>Quotation</p>
            </div>
          </div>
            </div>
            <div className='col-2 mt-1 d-flex justify-content-end'>
            <img src='/logo.jpg' alt="logo" width="230px" height="230px" />

            </div>
          </div>
        
          <div className="row" style={{marginTop:"-33px"}}>
            <table className="table table-bordered ms-4 mt-2 billTable">
              <tbody>
                <tr>
                  <th scope="col" colSpan="3">
                    <div className="from-address align-items-start">
                      <p>Bill To:<b>{billData?.customerName}</b></p>
                      <p>Address: {billData?.customerAddress}</p>
                      <p>phone: {billData?.customerMobile} </p>
                      {/* <p>GSTIN: 33BBMPM3084N1Z6</p> */}
                    </div>
                  </th>
                  <td scope="col" colSpan="2">
                    <div className="">
                      <p>Invoice No:<b>{billData?.billNumber}</b></p>
                      <p>Date:{billData?.datetime ? formatDate(new Date(billData?.datetime)) : formatDate(new Date())}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col" style={{ width: '70%' }}>
                    ITEM
                  </th>
                  <th scope="col">PRICE</th>
                  <th scope="col">QUANTITY</th>
                  <th scope="col">AMOUNT</th>
                </tr>
              </tbody>
              <tbody>
              {billData?.items.map((item, index) => (
            <tr style={{border:"none"}} key={index}>
              <th>{index + 1}</th>
              <th>{item.name}</th>
              <th>{item.price}</th>
              <th>{item.quantity}</th>
              <th>{item.price * item.quantity}</th>
            </tr>
          ))}
                <tr>
                  <th colSpan="4">Total</th>
                  <th>{calculateTotal()}</th>
                </tr>
            <tr>
                <td colSpan="5">
                  <div className="">
                    <p className="h6">Amount In Words</p>
                    <p>{numberToWords(calculateTotal())} Rupees only.</p>
                    <p className="h6">Declaration</p>
                    <p>
                      We declare that this invoice shows the actual price of
                      the goods described and that all particulars are true and
                      correct
                    </p>
                  </div>
                </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="d-flex justify-content-center">
        <ReactToPrint
   trigger={() => <button className='btn bg-primary text-white'>Print this out!</button>}
   content={() => ref.current}
 
  // //  onBeforeGetContent={() => {
     
  // //   }}
  onBeforePrint={() => {
    const printOptions = {
      silent: true,
    };
  }}
 />
 <button className='btn bg-primary text-white mx-4' onClick={() => generatePDF(ref, {filename: `${billData?.customerName}${billData?.billNumber}`})}>Download Pdf</button>
          </div>
          </div>
    
  );
}

export default Bill;
