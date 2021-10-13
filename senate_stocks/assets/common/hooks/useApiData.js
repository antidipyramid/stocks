import { useEffect, useState } from 'react';

export default function useApiData(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (url) {
      fetch(url)
        .then((response) => response.json())
        .then((apiData) => {
          setData(apiData);
        });
    }
  }, []);

  return data;
}
