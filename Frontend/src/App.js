import logo from "./logo.svg";
import "./App.css";
import { lazy, useState, Suspense } from "react";
import Grids from "./Grids";

const Users = lazy(() => import("./Users"));

function App() {
  const [loadUsers, setLoadUsers] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setLoadUsers(true)}>Load users</button>
        <button onClick={() => setLoadUsers(false)}>Hide users</button>

        {loadUsers && (
          <Suspense fallback={"Loading"}>
            <Users />
          </Suspense>
        )}

        {/* <Grids /> */}
      </header>
    </div>
  );
}

export default App;

async function delayFunc(promise) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
