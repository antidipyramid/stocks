import { useEffect, useState } from 'react';

export default function useMapData(attributeName, valueOptions) {
  const [input, setInput] = useState([]);
  const [mapData, setMapData] = useState(new Map());

  useEffect(() => {
    if (input) {
      let map = new Map(valueOptions.map((v) => [v, 0]));

      for (const entry of input) {
        if (map.has(entry[attributeName])) {
          let old = map.get(entry[attributeName]);
          map.set(entry[attributeName], old + 1);
        } else {
          map.set(entry[attributeName], 1);
        }
      }
      setMapData(map);
    }
  }, [input]);

  return [mapData, setInput];
}
