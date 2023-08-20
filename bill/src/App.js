import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import InvoiceBill from './InvoiceBill';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingItemName, setEditingItemName] = useState('');
  const [editingItemPrice, setEditingItemPrice] = useState('');
  const [editingItemQuantity, setEditingItemQuantity] = useState('');
  const [billNumber, setBillNumber] = useState(100); // Initial bill number
  const nameInputRef = useRef(null);

  const [billData,setBillData]=useState();
  const [open,setOpen]=useState(false);
 
  // const componentRef = useRef();

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  useEffect(() => {
    nameInputRef.current.focus();
  }, []);

  const generateBillNumber = () => {
    setBillNumber((prevBillNumber) => prevBillNumber + 1);
  };

  const addItem = () => {
    if (itemPrice) {
      const newItem = {
        name: itemName || ' ',
        price: parseFloat(itemPrice),
        quantity: parseInt(itemQuantity) || 1,
      };
      setItems([...items, newItem]);
      setItemName('');
      setItemPrice('');
      setItemQuantity('');
      nameInputRef.current.focus();
    }
  };

  const editItem = (index) => {
    const itemToEdit = items[index];
    setEditingIndex(index);
    setEditingItemName(itemToEdit.name);
    setEditingItemPrice(itemToEdit.price.toString());
    setEditingItemQuantity(itemToEdit.quantity.toString());
  };

  const updateItem = (index) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, name: editingItemName, price: parseFloat(editingItemPrice), quantity: parseInt(editingItemQuantity) } : item
    );
    setItems(updatedItems);
    setEditingIndex(-1);
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target.name === 'itemName') {
        document.getElementsByName('itemPrice')[0].focus();
      } else if (event.target.name === 'itemPrice') {
        document.getElementsByName('itemQuantity')[0].focus();
      } else if (event.target.name === 'itemQuantity') {
        addItem();
      }
    }
  };

  

  const handleSave = () => {
    const billData = {
      customerName,
      customerMobile,
      billNumber,
      datetime: new Date().toISOString(),
      items,
    };
    setOpen(true);
    setBillData(()=>billData);

    const blob = new Blob([JSON.stringify(billData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill_${billNumber}.json`;
    a.click();
  
  };
  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Billing App</h1>
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            placeholder="Customer Name"
            className="form-control"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Mobile Number"
            className="form-control"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value)}
          />
        </div>
        <div className="col">
        <p className="card-text">Date and Time: {new Date().toLocaleString()}</p>
        </div>
        <div className="col">
          <button className="btn btn-secondary btn-block" onClick={generateBillNumber}>Generate Bill No</button>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            name="itemName"
            placeholder="Item name (optional)"
            className="form-control"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={nameInputRef}
          />
        </div>
        <div className="col">
          <input
            type="number"
            name="itemPrice"
            placeholder="Item price"
            className="form-control"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="col">
          <input
            type="number"
            name="itemQuantity"
            placeholder="Quantity"
            className="form-control"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="col">
          <button className="btn btn-primary btn-block" onClick={addItem}>Add Item</button>
        </div>
      </div>
     
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Item Name</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Subtotal</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>
                {editingIndex === index ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editingItemName}
                    onChange={(e) => setEditingItemName(e.target.value)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    className="form-control"
                    value={editingItemPrice}
                    onChange={(e) => setEditingItemPrice(e.target.value)}
                  />
                ) : (
                  `$${item.price}`
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    className="form-control"
                    value={editingItemQuantity}
                    onChange={(e) => setEditingItemQuantity(e.target.value)}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>${item.price * item.quantity}</td>
              <td>
                {editingIndex === index ? (
                  <div>
                    <button className="btn btn-success btn-sm" onClick={() => updateItem(index)}>Save</button>
                    <button className="btn btn-secondary btn-sm ml-2" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button className="btn btn-info btn-sm" onClick={() => editItem(index)}>Edit</button>
                    <button className="btn btn-danger btn-sm ml-2" onClick={() => removeItem(index)}>Remove</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="text-right">Total:</td>
            <td>${calculateTotal()}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div className="row mb-3">
        <div className="col">
          <button className="btn btn-success btn-block" onClick={handleSave}>Save</button>
        </div>
        <div className="col">
          <button className="btn btn-primary btn-block" >Print</button>
        </div>
      </div>
     {open && 
    
     <div>
   
      <InvoiceBill  billData={billData} />
    </div>
}
    </div>
    
  );
}

export default App;
