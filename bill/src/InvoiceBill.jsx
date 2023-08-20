import React,{useRef} from 'react';
import './InvoiceBill.css'; // Import the stylesheet for styling
import ReactToPrint from "react-to-print";
function InvoiceBill({ billData }) {
    const ref=useRef(null)
  const { billNumber, customerName, customerMobile, items, datetime } = billData;

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const setFileName = () => {
    const fileName = `${billData.billNumber}-${billData.customerName}.pdf`;
    return fileName;
  };

  return (
    <>
    <div className="invoice" ref={ref}>
      <div className="invoice-header">
        <h2>Invoice Bill</h2>
        <p className="bill-number">Bill Number: {billNumber}</p>
        <p className="date-time">Date and Time: {new Date(datetime).toLocaleString()}</p>
      </div>
      <div className="customer-details">
        <p>Customer Name: {customerName}</p>
        <p>Customer Mobile: {customerMobile}</p>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>${item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total">
        <p>Total Amount: ${calculateTotal()}</p>
      </div>
     
    </div>
     <ReactToPrint
     trigger={() => <button style={{backgroundColor:"white",marginLeft:"300px",width:"300px",border:"1px solid black"}}>Print this out!</button>}
     content={() => ref.current}
     onBeforeGetContent={() => {
       
      }}
      onAfterPrint={() => {
        // Any post-printing actions you want to perform
        const fileName = setFileName();
        const link = document.createElement('a');
        link.href = '';
        link.download = fileName;
        link.click();
      }}
   />
   </>
  );
}

export default InvoiceBill;
