import React from 'react';
import PropTypes from 'prop-types';
require('datejs');

export default function RecentTrade({ trade }) {
  return (
    <div>
      <p>Date: {Date.parse(trade.transaction_date).toString('MMM d, yyyy')}</p>
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
