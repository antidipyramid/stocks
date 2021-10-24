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
    Alabama: 'AL',
    Alaska: 'AK',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    Delaware: 'DE',
    'District Of Columbia': 'DC',
    Florida: 'FL',
    Georgia: 'GA',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
    Maryland: 'MD',
    Massachusetts: 'MA',
    Michigan: 'MI',
    Minnesota: 'MN',
    Mississippi: 'MS',
    Missouri: 'MO',
    Montana: 'MT',
    Nebraska: 'NE',
    Nevada: 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Pennsylvania: 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    Virginia: 'VA',
    Washington: 'WA',
    'West Virginia': 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY',
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
