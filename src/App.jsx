import { useState } from 'react';

import { Memory } from './Memory';
import { Scheduling } from './Scheduling';

import './App.css';

function App() {

  const [resolver, setResolver] = useState(false);

  const handleClick = () => setResolver(prev => !prev)

  return (
    <>
      <h1>Resolvers!</h1>

      <button
        onClick={handleClick}
      >Cambiar</button>

      {
        resolver
        ?
        <Scheduling />
        :
        <Memory />
      }
    </>
  );
}

export default App
