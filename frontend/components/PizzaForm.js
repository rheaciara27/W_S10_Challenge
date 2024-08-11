import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormState, resetFormState, submitOrder,fetchOrders } from '../state/store';

export default function PizzaForm() {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.pizzaForm);
  const { fullName, size, toppings, status, error } = formState;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      dispatch(updateFormState({ toppings: { ...toppings, [name]: checked } }));
    } else {
      dispatch(updateFormState({ [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitOrder({ 
      fullName, 
      size, 
      toppings: Object.keys(toppings).filter((key) => toppings[key]) 
    })).then(() => {
      // After submitting, refetch the orders to update the list
      dispatch(fetchOrders());
    });
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>
      {status === 'loading' && <div className="pending">Order in progress...</div>}
      {status === 'failed' && <div className="failure">Order failed: {error}</div>}
      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            data-testid="fullNameInput"
            id="fullName"
            name="fullName"
            placeholder="Type full name"
            type="text"
            value={fullName}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            data-testid="sizeSelect"
            id="size"
            name="size"
            value={size}
            onChange={handleInputChange}
          >
            <option value="">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
      </div>
      <div className="input-group">
        {['Pepperoni', 'Green peppers', 'Pineapple', 'Mushrooms', 'Ham'].map((topping, index) => (
          <label key={index}>
            <input
              data-testid={`check${topping.replace(' ', '')}`}
              name={index + 1}
              type="checkbox"
              checked={toppings[index + 1]}
              onChange={handleInputChange}
            />
            {topping}<br />
          </label>
        ))}
      </div>
      <input data-testid="submit" type="submit" value="Order Pizza" />
    </form>
  );
}
