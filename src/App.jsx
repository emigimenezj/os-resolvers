import { useState } from 'react';

import { Memory } from './Memory';
import { Scheduling } from './Scheduling';

function App() {

  // Unnecesary comment to test vercel deployment

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
      <p style={{color: 'red'}}>IMPORTANTE: El objetivo es poder ofrecer feedback rápido para corroborar la solución de un ejercicio. No deben usarse estas resoluciones como fuente de la verdad porque no hay garantías de que estén 100% libres de bugs.</p>
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
