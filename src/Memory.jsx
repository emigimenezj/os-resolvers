import { useState } from 'react';
import { RequestListInput } from './components/RequestListInput';
import { resolver } from './resolvers/memory';
import { MemoryCarouselSolutions } from './components/MemoryCarouselSolutions';

export function Memory() {

  // cantidad de páginas: 6            
  // cantidad de marcos: 4
  // lista de peticiones: 1, 2, 1, 3, 4, 3, 5, 6, 2

  const [pages, setPages] = useState('');
  const [frames, setFrames] = useState('');
  const [memoryRequestSequence, setMemoryRequestSequence] = useState(['']);
  const [solutions, setSolutions] = useState([]);

  const handleChangePageInput = (event) => {
    const { value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;
    
    setPages(value ? parseInt(value, 10) : value);
  }

  const handleChangeFrameInput = (event) => {
    const { value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;
    
    setFrames(value ? parseInt(value, 10) : value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const sol = resolver({ memoryRequestSequence, frames, type: event.target.algorithm.value });
    
    setSolutions(prev => [...prev, sol]);
  }

  return (
    <main>
      <header>
        <h1>Memory!</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor='algorithm'>Tipo de algoritmo:</label>
          <select id="algorithm" className="select" name="algorithm" defaultValue="FIFO">
            <option value="FIFO">First Come First Serve (FCFS o FIFO)</option>
            <option value="LRU">Last Recently Used (LRU)</option>
            <option value="SC">Second Chance (SC)</option>
          </select>
          <br />
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
      <section>
        <header className='carousel-solutions-header'>
          <button className='btn-clean'
            disabled={solutions.length === 0}
            onClick={() => setSolutions([])}
          >Limpiar</button>
        </header>
        <MemoryCarouselSolutions solutions={solutions} />
      </section>
    </main>
  );
}