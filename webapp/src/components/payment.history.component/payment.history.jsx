import React from 'react';
import './payment.history.component.scss';
import { GrowthGraph } from '../growth.graph.component/growth.graph';
import Skeleton from 'react-loading-skeleton';
import { months } from '../../helpers/timeformatter';
import { dummuyData } from './dummydata.js';

const createPayments = (payments=dummuyData) => {
  const list = [];
  if (payments.length > 0) {
    return payments.map(entry => {
      const _date = new Date(entry.time);
      return (
        <li key={_date.toString()} className="flex flex-row-nowrap align-items-center justify-content-between payment-history-item">
          <div className="payment-date">
            <span className="payment-day">{ _date.getDate() }</span>
            <div className="flex flex-row-nowrap">
              <span className="payment-month">{ months[_date.getMonth()] }</span>
              <span className="payment-year">{ _date.getFullYear() }</span>
            </div>
          </div>
          <div className="payment-amount">
            { `$ ${entry.amount}` }
          </div>
        </li>
      );
    })
  } else {
    for (let i = 0; i < 10; i++) {
      list.push(
        <li key={i} className="flex flex-row-nowrap justify-content-between payment-history-item">
          <Skeleton height={70} width={70}/>
          <div className="flex-grow-1 padding-left-8">
            <Skeleton width={'100%'} />
          </div>
        </li>
      );
    }
  }
  return list;
}

const PaymentHistoryNInsights = (props) => {
  
  const { totalAmount=20000, payments=[] } = props;
  
  return (
    <div className="payment-history-container flex flex-column-nowrap">
      <GrowthGraph totalAmount={totalAmount}/>
      <div className="history-container">
        <h2 className="header">Payment History</h2>
       <ul className="ul">
        { createPayments() }
       </ul>
      </div>
    </div>
  );
}
export default PaymentHistoryNInsights;