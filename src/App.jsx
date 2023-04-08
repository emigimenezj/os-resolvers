import { useState } from 'react';

import { Memory } from './Memory';
import { Scheduling } from './Scheduling';

import './App.css';

function App() {

  const [pickSched, setPickSched] = useState(false);

  const handleClick = () => setPickSched(prev => !prev)

  return (
    <>
      <h1>Resolvers!</h1>

      <button
        onClick={handleClick}
      >Cambiar</button>

      {
        pickSched
        ?
        <Scheduling />
        :
        <Memory />
      }
    </>
  );
}

export default App
