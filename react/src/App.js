import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { DB1App } from "./components/db1/db1"
import { DB2App } from "./components/db2/db2"


const App = () => {
  const [state, setState] = useState({
    activeApp: 1,

  })

  return (
    <>
      <h1>Clarity FM Web App</h1>

      <button onClick={() => { setState({ activeApp: 1 }) }}>App 1</button><button onClick={() => { setState({ activeApp: 2 }) }}>App 2</button>
      <div className="container">
        {state.activeApp == 1 ?
          DB1App() :
          DB2App()
        }
      </div>
    </>
  );
}

export default App;
