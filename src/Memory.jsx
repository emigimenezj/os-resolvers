import { useRef, useState } from 'react';

export function Memory() {

  // cantidad de marcos: 4
  // cantidad de páginas: 6            
  // lista de peticiones: 1, 2, 1, 3, 4, 3, 5, 6, 2

  const [pages, setPages] = useState('');
  const [frames, setFrames] = useState('');

  const [memoryRequestSequence, setMemoryRequestSequence] = useState(['']);
  const inputRefs = useRef([null]);

  const [table, setTable] = useState({ memory: [[]], replaceOrder: [[]] });

  const handleChange = (index, event) => {
    const { value } = event.target;

    if(value === ' ') return;

    if(value.at(-1) === ' ' && index < memoryRequestSequence.length - 1)
      inputRefs.current[index + 1].focus();
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;

    setMemoryRequestSequence((prevPages) => {
      const newPages = [...prevPages];
      newPages[index] = value;
      return newPages;
    });
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !memoryRequestSequence[index] && index > 0) {
      event.preventDefault();
      setMemoryRequestSequence((prevPages) => {
        const newPages = [...prevPages];
        newPages.pop();
        return newPages;
      });
      inputRefs.current.pop();
      inputRefs.current[index - 1].focus();
    }
    if (event.key === ' ' && event.target.value) {
      setMemoryRequestSequence((prevPages) => [...prevPages, '']);
      inputRefs.current.push(null);
    }
  }

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

  const handleError = () => {
    const badPages = [];

    for (const page of memoryRequestSequence) {
      if (~~page > pages) {
        badPages.push(page);
      }
    }

    return (
      <div style={{color: 'red'}}>
        {
          badPages.map((p, i) => <p key={i}>La página {p} está fuera de rango.</p>)
        }
      </div>
    );
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
          <label>Ingresá la lista de peticiones de memoria:</label>
          <div className="pages-numbers-inputs-container">
            {memoryRequestSequence.map((digit, index) => (
              <input
                disabled={!pages || !frames}
                key={index}
                type="text"
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
            {handleError()}
          </div>
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