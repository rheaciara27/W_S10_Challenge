import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../state/orderSlice';
import { setSizeFilter } from '../state/sizeFilterSlice';

export default function OrderList() {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);
  const orderStatus = useSelector(state => state.orders.status);
  const sizeFilter = useSelector(state => state.sizeFilter);

  useEffect(() => {
    if (orderStatus === 'idle') {
      dispatch(fetchOrders());
    }
  }, [orderStatus, dispatch]);

  const filteredOrders = orders.filter(order => sizeFilter === 'All' || order.size === sizeFilter);

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {orderStatus === 'loading' && <div>Loading...</div>}
      {orderStatus === 'failed' && <div>Error loading orders</div>}
      <ol>
        {
          filteredOrders.map(order => (
            <li key={order.id}>
              <div>
                {order.details}
              </div>
            </li>
          ))
        }
      </ol>
      <div id="sizeFilters">
        Filter by size:
        {
          ['All', 'S', 'M', 'L'].map(size => {
            const className = `button-filter${size === sizeFilter ? ' active' : ''}`;
            return <button
              data-testid={`filterBtn${size}`}
              className={className}
              key={size}
              onClick={() => dispatch(setSizeFilter(size))}
              >{size}</button>
          })
        }
      </div>
    </div>
  );
}
