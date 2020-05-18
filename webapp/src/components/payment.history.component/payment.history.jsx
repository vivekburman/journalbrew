import React from 'react';
import './payment.history.component.scss';
import { GrowthGraph } from '../growth.graph.component/growth.graph';
import Skeleton from 'react-loading-skeleton';

const createPayments = (payments=[]) => {
  const list = [];
  if (payments.length > 0) {

  } else {
    for (let i = 0; i < 10; i++) {
      list.push(
        <div className="flex flex-row-nowrap justify-content-between payment-history-item">
          <Skeleton height={60} width={60}/>
          <div className="flex-grow-1">
            <Skeleton />
          </div>
          <div className="flex-grow-1">
            <Skeleton />
          </div>
        </div>
      );
    }
  }
  return list;
}

const PaymentHistoryNInsights = (props) => {
  
  const { totalAmount='20,000', payments=[] } = props;
  
  return (
    <div className="payment-history-container flex flex-column-nowrap">
      <GrowthGraph />
      <div className="totalAmount">{ `Total Earning: ${totalAmount}` }</div>
      <div>
        <div>Payment History</div>
        { createPayments(payments) }
      </div>
    </div>
  );
}
export default PaymentHistoryNInsights;