import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'


function App() {
  const [count, setCount] = useState(0)

  const fetchapi = async () => {
    try {
        const res = await axios.get("http://localhost:8080");
        setCount(res.data.response);
        // console.log(resp.data.response);
    } catch (error) {
        console.error("Error fetching from API:", error);
    }
};

useEffect(() => {
    fetchapi();
    console.log(count)
},[]);
  return (
    <>
      <p>{count}</p>
    </>
  )
}

export default App
