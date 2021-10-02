import React from 'react';
import PropTypes from 'prop-types';

export default function RecentTrade({ trade }) {
  return (
    <div>
      <p>Date: {trade.transaction_date}</p>
      <p>Senator: {trade.senator}</p>
      <p>Owner: {trade.owner}</p>
      <p>Asset Type: {trade.asset_type}</p>
      <p>Transaction Type: {trade.transaction_type}</p>
      <p>Amount: {trade.amount}</p>
    </div>
  );
}

RecentTrade.propTypes = {
  trade: PropTypes.object,
};
