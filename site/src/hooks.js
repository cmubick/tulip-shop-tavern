import { useState, useEffect } from "react";
function useFetch(url) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);  
  const fetchUrl = async () => {
    const myHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    });
    const response = await fetch(url, {headers: myHeaders});
    const json = await response.json();
    setData(json);
    setLoading(false);
  }
  useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading];
}
export { useFetch };