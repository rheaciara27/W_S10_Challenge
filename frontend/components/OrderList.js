import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders,setSizeFilter } from "../state/store.js";

export default function OrderList() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.list);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);
  const sizeFilter = useSelector((state) => state.sizeFilter);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter(order => 
    sizeFilter === 'All' || order.size === sizeFilter
  );

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      <ol>
        {filteredOrders.map((order, index) => (
          <li key={index}>
            <div>

  {order.customer} ordered a size {order.size} {"with "} 
  {order.toppings ? order.toppings.length : ' no'} toppings 
 
            </div>
          </li>
        ))}
      </ol>
      <div id="sizeFilters">
        Filter by size:
        {['All', 'S', 'M', 'L'].map((size) => {
          const className = `button-filter${size === sizeFilter ? ' active' : ''}`;
          return (
            <button
              data-testid={`filterBtn${size}`}
              className={className}
              key={size}
              onClick={() => dispatch(setSizeFilter(size))}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
