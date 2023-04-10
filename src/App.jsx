import { useState } from 'react';

import { Memory } from './Memory';
import { Scheduling } from './Scheduling';

function App() {

  const [pickSched, setPickSched] = useState(false);

  const handleClick = () => setPickSched(prev => !prev)

  return (
    <>
      <header>
        <h1>Resolvers!</h1>
      </header>
      <nav>
        <button
          onClick={handleClick}
        >Cambiar</button>
      </nav>
      {
        pickSched
        ? <Scheduling />
        : <Memory />
      }
    </>
  );
}

export default App
