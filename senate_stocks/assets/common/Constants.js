import React from 'react';

export const amounts = [
    '$1,001 - $15,000',
    '$15,001 - $50,000',
    '$50,001 - $100,000',
    '$100,001 - $250,000',
    '$250,001 - $500,000',
    '$500,001 - $1,000,000',
    '$1,000,001 - $5,000,000',
    '$5,000,001 - $25,000,000',
    '$25,000,001 - $50,000,000',
    'Over $50,000,000',
  ],
  owners = ['Self', 'Spouse', 'Child', 'Joint'],
  assetTypes = [
    'Stock',
    'Corporate Bond',
    'Municipal Security',
    'Non-Public Stock',
    'Other Securities',
  ],
  states = {
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District Of Columbia',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
  },
  parties = ['R', 'D', 'I'],
  transactionTypes = ['Purchase', 'Sale (Partial)', 'Sale (Full)', 'Exchange'],
  columns = [
    { title: 'Date', field: 'transaction_date', type: 'date' },
    { title: 'Senator', field: 'senator', filtering: false },
    {
      title: 'Owner',
      field: 'owner',
      lookup: Object.fromEntries(owners.map((o) => [o, o])),
    },
    {
      title: 'Asset Type',
      field: 'asset_type',
      lookup: Object.fromEntries(assetTypes.map((t) => [t, t])),
    },
    {
      title: 'Transaction Type',
      field: 'transaction_type',
      lookup: Object.fromEntries(transactionTypes.map((t) => [t, t])),
    },
    {
      title: 'Amount',
      field: 'amount',
      lookup: Object.fromEntries(amounts.map((a) => [a, a])),
    },
    { title: 'Comments', field: 'comments', filtering: false, sorting: false },
    {
      title: 'Link To Original',
      field: 'url',
      render: (rowData) => <a href={rowData.url}>Link</a>,
      filtering: false,
      sorting: false,
    },
  ];
