import { useState } from 'react';
import { RequestListInput } from './components/RequestListInput';
import { resolver } from './resolvers/memory';
import { MemoryCarouselSolutions } from './components/MemoryCarouselSolutions';

export function Memory() {

  // cantidad de marcos: 4
  // cantidad de páginas: 6            
  // lista de peticiones: 1, 2, 1, 3, 4, 3, 5, 6, 2

  const [pages, setPages] = useState('');
  const [frames, setFrames] = useState('');

  const [memoryRequestSequence, setMemoryRequestSequence] = useState(['']);

  const [solutions, setSolutions] = useState([]);

  const handleChangePageInput = (event) => {
    const { value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;
    
    setPages(parseInt(value, 10));
  }

  const handleChangeFrameInput = (event) => {
    const { value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;
    
    setFrames(parseInt(value, 10));
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const sol = resolver({ memoryRequestSequence, frames, type: 'LRU' });
    
    setSolutions(prev => [...prev, sol]);
  }

  return (
    <section>
      <header>
        <h1>Memory!</h1>
        <form onSubmit={handleSubmit}>
          <label>Cantidad de páginas:</label>
          <input onChange={handleChangePageInput} type="text" value={pages} />
          <br />
          <label>Cantidad de marcos de página (frames):</label>
          <input onChange={handleChangeFrameInput} type="text" value={frames} />
          <br />
          <RequestListInput 
            pages={pages}
            frames={frames}
            memoryRequestSequence={memoryRequestSequence}
            setMemoryRequestSequence={setMemoryRequestSequence}
          />
          <button 
            disabled={!pages || !frames || memoryRequestSequence.some(p => p < 1 || p > pages)}
            type="submit">
              Calcular
          </button>
        </form>
      </header>
      <main>
        <button
          disabled={solutions.length === 0}
          onClick={() => setSolutions([])}
        >Limpiar</button>
        <MemoryCarouselSolutions solutions={solutions} />
      </main>
    </section>
  );
}