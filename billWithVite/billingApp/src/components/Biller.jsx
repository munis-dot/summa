import React, { useState, useRef, useEffect, useReducer } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import InvoiceBill from './InvoiceBill';
// import * as firebase from './firebase';
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, setDoc, query, orderBy, limit, updateDoc } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import Bill from './bill';
import { useDispatch, useSelector } from 'react-redux';
import { addBill, changeAddBill, changeEditBill, editBill } from './reduxSlice';

function Biller() {

  const dispatch = useDispatch()
  const redux = useSelector(state => state)
  const addInitialData = redux.bill?.addBill?.[redux.bill?.tabIndex]
  const editInitialData = redux.bill?.editBill?.[redux.bill?.tabIndex]
  const defaultData = {
    customerAddress: '',
    customerMobile: "",
    customerName: "",
    billNumber: 0,
    credit:false,
    items: []
  }

  const state = useLocation();
  const [mode, setMode] = useState({ isEdit: false });
  const [temp, setTemp] = useState();


  // const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  // const [customerName, setCustomerName] = useState('');
  // const [customerMobile, setCustomerMobile] = useState('');
  // const [customerAddress,setCustomerAddress] = useState('')

  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingItemName, setEditingItemName] = useState('');
  const [editingItemPrice, setEditingItemPrice] = useState('');
  const [editingItemQuantity, setEditingItemQuantity] = useState('');

  const [billNumber, setBillNumber] = useState(0); // Initial bill number

  const nameInputRef = useRef(null);

  const [billData, setBillData] = useState();
  const [open, setOpen] = useState(false);


  useEffect(() => {
    if (addInitialData) {
      setMode(() => ({ isEdit: false }))
      setTemp(addInitialData)
    }
    else if (editInitialData) {
      setMode(() => ({ isEdit: true }))
      setTemp((prev) =>
        (editInitialData)
      )
    }
    else if (window.location.pathname.includes('EditBill')) {

      setMode(() => ({ isEdit: true }))
      dispatch(editBill({
        tabIndex: window.location.pathname.split('/').pop(), data: {
          customerAddress: state.state.data.billData.customerAddress,
          credit: state.state.data.billData.credit,
          customerMobile: state.state.data.billData.customerMobile,
          customerName: state.state.data.billData.customerName,
          items: state.state.data.billData.items,
          billNumber: state.state.data.billData.billNumber,
          datetime: state.state.data.billData.datetime,
          refId: state.state.data.refId
        }
      }))
      setTemp(() => ({
        customerAddress: state.state.data.billData.customerAddress,
        customerMobile: state.state.data.billData.customerMobile,
        credit: state.state.data.billData.credit,
        customerName: state.state.data.billData.customerName,
        items: state.state.data.billData.items,
        billNumber: state.state.data.billData.billNumber,
        datetime: state.state.data.billData.datetime
      }))
    }
    else {
      setMode(() => ({ isEdit: false }))
      dispatch(addBill({ tabIndex: redux.bill.tabIndex, data: defaultData }))
      setTemp(defaultData)
    }

  }, [redux.bill.tabIndex])

  const handleChange = (e) => {
    if (mode.isEdit) {
      dispatch(changeEditBill({ tabIndex: redux.bill.tabIndex, name: e.target.name, data: e.target.checked != undefined  ? e.target.checked : e.target.value}))
      setTemp((prev) => ({
        ...prev, [e.target.name]: e.target.checked ? e.target.checked != undefined : e.target.value
      }))
    }
    else {
      dispatch(changeAddBill({ tabIndex: redux.bill.tabIndex, name: e.target.name, data: e.target.checked != undefined ? e.target.checked : e.target.value }))
      setTemp((prev) => ({
        ...prev, [e.target.name]: e.target.checked!= undefined ? e.target.checked : e.target.value
      }))
    }
  }


  const billnumber = async () => {
    const q = query(collection(db, "bill"), orderBy("id", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    const lastDoc = querySnapshot.docs?.[0];
    setBillNumber(() => parseInt(lastDoc.data()?.id, 10))
  }

  useEffect(() => {
    nameInputRef.current.focus();
    billnumber();
  }, [billData]);



  const addItem = () => {
    if (itemPrice) {
      const newItem = {
        name: itemName || ' ',
        price: parseFloat(itemPrice),
        quantity: parseInt(itemQuantity) || 1,
      };
      if (mode.isEdit) {
        dispatch(changeEditBill({ tabIndex: redux.bill.tabIndex, name: "items", data: [...editInitialData.items, newItem] }))
        setTemp((prev) => ({
          ...prev, items: [...temp.items, newItem]
        }))
      }
      else {
        dispatch(changeAddBill({ tabIndex: redux.bill.tabIndex, name: "items", data: [...addInitialData.items, newItem] }))
        setTemp((prev) => ({
          ...prev, items: [...temp.items, newItem]
        }))
      }
      // setItems([...items, newItem]);
      setItemName('');
      setItemPrice('');
      setItemQuantity('');
      nameInputRef.current.focus();
    }
  };

  const editItem = (index) => {
    const itemToEdit = temp.items[index];
    setEditingIndex(index);
    setEditingItemName(itemToEdit.name);
    setEditingItemPrice(itemToEdit.price.toString());
    setEditingItemQuantity(itemToEdit.quantity.toString());
  };

  const updateItem = (index) => {
    const updatedItems = temp.items.map((item, i) =>
      i === index ? { ...item, name: editingItemName, price: parseFloat(editingItemPrice), quantity: parseInt(editingItemQuantity) } : item
    );
    if (mode.isEdit) {
      dispatch(changeEditBill({ tabIndex: redux.bill.tabIndex, name: "items", data: updatedItems }))
      setTemp((prev) => ({
        ...prev, items: updatedItems
      }))
    }
    else {
      dispatch(changeAddBill({ tabIndex: redux.bill.tabIndex, name: "items", data: updatedItems }))
      setTemp((prev) => ({
        ...prev, items: updatedItems
      }))
    }
    // setItems(updatedItems);
    setEditingIndex(-1);
    focusRow(index);
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
  };

  const removeItem = (index) => {
    const updatedItems = temp.items.filter((_, i) => i !== index);
    if (mode.isEdit) {
      dispatch(changeEditBill({ tabIndex: redux.bill.tabIndex, name: "items", data: updatedItems }))
      setTemp((prev) => ({
        ...prev, items: updatedItems
      }))
    }
    else {
      dispatch(changeAddBill({ tabIndex: redux.bill.tabIndex, name: "items", data: updatedItems }))
      setTemp((prev) => ({
        ...prev, items: updatedItems
      }))
    }
    // setItems(updatedItems);
  };

  const calculateTotal = (items) => {
    return items?.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const calculateTotal2 = () => {
    return temp?.items?.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleKeyPress = (event) => {

    if (event.key === 'Enter') {
      if (event.target.name === 'itemName') {
        document.getElementsByName('itemPrice')[0].focus();
      } else if (event.target.name === 'itemPrice' && itemPrice) {
        document.getElementsByName('itemQuantity')[0].focus();
      } else if (event.target.name === 'itemQuantity') {
        addItem();
      }
    }

  };



  const handleSave = async (e) => {

    const billData = {
      customerName: addInitialData.customerName,
      customerAddress: addInitialData.customerAddress,
      billNumber: billNumber + 1,
      customerMobile: addInitialData.customerMobile,
      datetime: new Date().toLocaleString(),
      items: addInitialData.items,
      total: calculateTotal(addInitialData?.items),
      credit:addInitialData.credit
    };

    await addDoc(collection(db, "bill"), {
      datetime: new Date().toISOString(),
      id: billNumber + 1,
      billData: billData
    });

    setOpen(true);
    setBillData(() => billData);
    setTemp();
    dispatch(addBill({ tabIndex: redux.bill.tabIndex, data: defaultData }))
  };

  const handleUpdate = async (e) => {
    const billData = {
      customerName: editInitialData.customerName,
      customerAddress: editInitialData.customerAddress,
      billNumber: editInitialData.billNumber,
      customerMobile: editInitialData.customerMobile,
      datetime: editInitialData.datetime,
      items: editInitialData.items,
      credit:editInitialData.credit,
      total: calculateTotal(editInitialData?.items)
    };

    const docs = doc(db, 'bill', editInitialData.refId)

    await setDoc(docs, { billData }, { merge: true }).then(docRef => {
      console.log("Entire Document has been updated successfully", docRef);
    })
      .catch(error => {
        console.log(error);
      });

    setOpen(true);
    setBillData(() => billData);
    // setTemp();
  }

  useEffect(() => {
    // Event listener for Alt + Ctrl key or F2 key
    const handleGlobalKeyPress = (event) => {
      const focusedElement = document.activeElement;

      if ((event.altKey && event.ctrlKey) || event.key === 'F2') {
        if (!focusedElement || !focusedElement.closest('table')) {
          focusFirstRow();
        } else {
          document.getElementsByName('itemName')[0].focus();
          cancelEdit();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyPress);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, []);

  const focusFirstRow = () => {
    const firstRow = document.querySelector('tbody tr:last-child');
    if (firstRow) {
      firstRow.focus();
    }
  };



  const handleRowKeyDown = (event, index) => {
    switch (event.key) {
      // ... Your existing code ...
      case 'Enter':
        if (event.target.name === 'itemName1') {
          document.getElementsByName('itemPrice1')[0].focus();
        } else if (event.target.name === 'itemPrice1') {
          document.getElementsByName('itemQuantity1')[0].focus();
        } else if (event.target.name === 'itemQuantity1') {
          updateItem(index)

        } else {
          editItem(index);
          focusEditingItemNameInput();
        }
        break;
      case 'ArrowUp':
        focusPreviousRow(index);
        cancelEdit();
        break;
      case 'ArrowDown':
        focusNextRow(index);
        cancelEdit();
        break;
      case 'Delete':
        if (index !== editingIndex) {
          removeItem(index);
          focusRow(Math.max(0, index - 1)); // Focus the row above, ensuring index is >= 0
        }
        else if (isAnyEditingInputFocused() == false) {
          cancelEdit();
          focusRow(index);
        }
        else {
          console.log("first")
        }
        break;
      case 'Escape':
        if (editingIndex === index) {
          cancelEdit();
          focusRow(index);
        }
        break;
      default:
        break;
    }
  };

  const focusRow = (index) => {

    const row = document.getElementById(`row-${index}`);
    if (row) {
      console.log("first")
      row.focus();
    }
  };

  const focusPreviousRow = (currentIndex) => {
    const currentRow = document.querySelector(`[tabindex="${currentIndex + 1}"]`);
    if (currentRow) {
      const previousRow = currentRow.previousElementSibling;
      if (previousRow) {
        previousRow.focus();
      }
    }
  };

  const focusNextRow = (currentIndex) => {
    const currentRow = document.querySelector(`[tabindex="${currentIndex + 1}"]`);
    if (currentRow) {
      const nextRow = currentRow.nextElementSibling;
      if (nextRow) {
        nextRow.focus();
      }
    }
  };

  const focusEditingItemNameInput = () => {
    const editingItemNameInput = document.getElementById('editingItemNameInput');
    if (editingItemNameInput) {
      editingItemNameInput.focus();
    }
  };
  const isAnyEditingInputFocused = () => {
    const editingInputIds = ['editingItemNameInput', 'editingItemNameInput2', 'editingItemNameInput3']; // Add your input IDs here
    return editingInputIds.some((inputId) => {
      const editingInput = document.getElementById(inputId);
      return editingInput === document.activeElement;
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">TipTop Billing App</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className='btn bg-primary text-light mb-3'><Link to='/bill/BillList'><h6 className='text-light'>Sales</h6></Link></button>
          <div>
      <label style={{ paddingRight: "10px" }} htmlFor="credit">
        Credit
      </label>
      <input
        type="checkbox"
        id="credit"
        name="credit"
        checked={temp?.credit}
        onChange={handleChange}
      />
    </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            placeholder="Customer Name"
            className="form-control"
            name='customerName'
            value={temp?.customerName}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Mobile Number"
            className="form-control"
            name='customerMobile'
            value={temp?.customerMobile}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            placeholder="Address"
            className="form-control"
            name='customerAddress'
            value={temp?.customerAddress}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="col">
          <p className="card-text">Date and Time: {new Date().toLocaleString()}</p>
        </div>
        {/* <div className="col">
          <button className="btn btn-secondary btn-block" onClick={generateBillNumber}>Generate Bill No</button>
        </div> */}
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
        <tbody >
          {temp?.items.map((item, index) => (
            <tr key={index} tabIndex={index + 1} id={`row-${index}`} onKeyDown={(event) => handleRowKeyDown(event, index)}>
              <th scope="row">{index + 1}</th>
              <td>
                {editingIndex === index ? (
                  <input
                    type="text"
                    className="form-control"
                    name='itemName1'
                    id="editingItemNameInput"
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
                    id='editingItemNameInput2'
                    name='itemPrice1'
                    value={editingItemPrice}
                    onChange={(e) => setEditingItemPrice(e.target.value)}
                  />
                ) : (
                  `${item.price}`
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    className="form-control"
                    name='itemQuantity1'
                    id='editingItemNameInput3'
                    value={editingItemQuantity}
                    onChange={(e) => setEditingItemQuantity(e.target.value)}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>{item.price * item.quantity}</td>
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
            <td>₹{calculateTotal2()}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      {temp?.items.length > 0 && <div className="row mb-3">
        {/* <div className="col">
          <button className="btn btn-success btn-block" onClick={handleSave}>Save</button>
        </div> */}
        <div className="col d-flex flex-row-reverse">
          <button className="btn btn-primary btn-block" onClick={e => { mode.isEdit ? handleUpdate() : handleSave() }} >{mode.isEdit ? "Update & Preview" : "Save & Preview"}</button>
        </div>
      </div>}
      {open &&
        <div>
          <Bill billData={billData} />
        </div>
      }
    </div>

  );
}

export default Biller;
