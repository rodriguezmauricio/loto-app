import { useState, useEffect } from "react";

const useFetchData = (url: string) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(url)
          .then((res) => res.json())
          .then((data) => setData(data));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [url]);

  return { data };
};

export default useFetchData;
