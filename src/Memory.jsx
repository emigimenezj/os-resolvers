import { useState } from 'react';
import { RequestListInput } from './components/RequestListInput';

export function Memory() {

  // cantidad de marcos: 4
  // cantidad de páginas: 6            
  // lista de peticiones: 1, 2, 1, 3, 4, 3, 5, 6, 2

  const [pages, setPages] = useState('');
  const [frames, setFrames] = useState('');

  const [memoryRequestSequence, setMemoryRequestSequence] = useState(['']);

  const [table, setTable] = useState({ memory: [[]], replaceOrder: [[]] });

  const handleChangePageInput = (event) => {
    const { value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;
    
    setTable({ memory: [[]], replaceOrder: [[]] });
    setPages(value);
  }

  const handleChangeFrameInput = (event) => {
    const { value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;
    
    setTable({ memory: [[]], replaceOrder: [[]] });
    setFrames(value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(memoryRequestSequence)

    let misses = 0;
    let hits = 0;

    const newTable = memoryRequestSequence.reduce(({memory, replaceOrder}, page, i) => {

      const mem = [...memory[i]];
      const order = [...replaceOrder[i]];

      if (!mem.includes(page)) {
        if (mem.length < frames) {
          const newMem = [...mem, page];
          const newOrder = [...order, page];
          misses++;
          memory.push(newMem);
          replaceOrder.push(newOrder);
          return {memory, replaceOrder}
        } else {
          const [pageToReplace] = order;
          const pageIndexToReplace = mem.findIndex(page => page === pageToReplace);

          mem.splice(pageIndexToReplace, 1, page);
          order.shift();
          order.push(page);

          memory.push(mem);
          replaceOrder.push(order);
          return {memory, replaceOrder}
        }
      }

      memory.push(mem);
      replaceOrder.push(order);
      hits++;
      return {memory, replaceOrder}

    }, { memory: [[]], replaceOrder: [[]] });

    setTable(newTable);
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
            disabled={!pages || !frames || memoryRequestSequence.some(p => ~~p < 1 || ~~p > pages)}
            type="submit">
              Calcular
          </button>
        </form>
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th>Petición</th>
              <th>Memoria</th>
              <th>Orden de reemplazo</th>
            </tr>
          </thead>
          <tbody>
            {table.memory.length !== 1 ?
              memoryRequestSequence.map((page, i) => {
                return (
                  <tr key={i}>
                    <td>{page}</td>
                    <td>{...table.memory[i+1]}</td>
                    <td>{...table.replaceOrder[i+1]}</td>
                  </tr>
                );
              })
              : null
            }
          </tbody>
        </table>
      </main>
    </section>
  );
}