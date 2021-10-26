export function dateRowAccessor(row) {
  let arr = row.transaction_date.split('-'),
    date_string = arr[1] + '/' + arr[2] + '/' + arr[0];

  return Date.parse(date_string);
}
