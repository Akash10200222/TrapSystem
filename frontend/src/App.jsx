import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/count/latest")
      .then(res => res.json())
      .then(data => setCount(data.value || 0));

    const interval = setInterval(() => {
      fetch("/api/count/latest")
        .then(res => res.json())
        .then(data => setCount(data.value || 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>TRAP SYSTEM</h1>
      <div className="count-box">
        <p>Current Count</p>
        <h2>{count}</h2>
      </div>
    </div>
  );
}

export default App;