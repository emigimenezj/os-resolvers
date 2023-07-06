import { useState } from 'react';

import { Memory } from './Memory';
import { Scheduling } from './Scheduling';

function App() {

  const [pickSched, setPickSched] = useState(true);

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
      <p style={{color: 'red'}}>IMPORTANTE: El objetivo de este proyecto es que puedan tener un punto de referencia con feedback rápido para que puedan corroborar sus soluciones. No debe usarse como fuente de la verdad.</p>
      <p style={{color: 'red'}}>1. Este recurso es de carácter extraoficial y <u>no puede ser utilizado</u> como justificación para validar la corrección de los ejercicios en un parcial o en una revisión. </p>
      <p style={{color: 'red'}}>2. Este recurso <u>no cubre la totalidad</u> de los contenidos vistos en clase. El parcial se evalúa sobre los ejercicios de las guías, no sobre el contenido que se encuentra a disposición acá.</p>

      {
        pickSched
        ? <Scheduling />
        : <Memory />
      }
    </>
  );
}

export default App
