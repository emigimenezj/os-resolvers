import { useState } from 'react';

import { resolver } from './resolvers/scheduling';

import './styles/scheduling.css';


export function SchedulingCarouselSolutions({ solutions }) {
  return (
    <h1>Hola 😛</h1>
  )
}

export function Scheduling() {

  const emptyProcess = { burst: 0, arrival: 0, priority: 0 };

  const [processes, setProcesses] = useState([{...emptyProcess}]);
  const [quantum, setQuantum] = useState('');
  const [solutions, setSolutions] = useState([]);

  const handleChangeProcessesInput = (event) =>
    setProcesses(Array.from(Array(~~event.target.value), () => ({...emptyProcess})));
  
  const onTableChange = (event) => {
    const [i, prop] = event.target.name.split('-');
    setProcesses(prev => {
      const newProc = [...prev];
      newProc[i][prop] = event.target.value;
      return newProc;
    });
  }

  const handleQuantumInput = (event) => setQuantum(parseInt(event.target.value, 10))

  const handleSubmit = (event) => {
    event.preventDefault();

    const copyProcesses = [...processes];
    console.log(copyProcesses)
    const sol = resolver({processes: copyProcesses, quantum});

    setSolutions(prev => [...prev, sol]);

    console.log("Pos submit! :v");
  }

  return (
    <main>
      <header>
        <h1> Scheduling ! </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="sched-algorithm">Tipo de algoritmo:</label>
          <select id="sched-algorithm" className="select" name="algorithm" defaultValue="FIFO">
            <option value="FIFO">First-Come, First-Serve (FCFS o FIFO)</option>
            <option value="LRU">Shortest-Job-First</option>
            <option value="SC">Multilevel Queue</option>
          </select>
          <br />
          <label htmlFor="scheduling-form-input-processes">Cantidad de procesos:</label><br/>
          <input
            id="scheduling-form-input-processes"
            name="processes"
            type="range"
            min={1}
            max={10}
            step={1}
            defaultValue={1}
            onChange={handleChangeProcessesInput}
          /> {processes.length}
          <br />
          <label htmlFor="scheduling-form-input-preemptive">
            Quantum: 
          </label>
          <input
            id="scheduling-form-input-preemptive"
            name="preemptive"
            placeholder="0"
            onChange={handleQuantumInput}
            value={quantum}
          />
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Ráfaga</th>
                <th>Llegada</th>
                <th>Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {
                processes.map((p, i) => (
                  <tr key={i}>
                    <td>P{i+1}</td>
                    <td><input onChange={onTableChange} name={`${i}-burst`} value={p.burst}/></td>
                    <td><input onChange={onTableChange} name={`${i}-arrival`} value={p.arrival?p.arrival:''} placeholder='0'/></td>
                    <td><input onChange={onTableChange} name={`${i}-priority`} value={p.priority?p.priority:''} placeholder='0'/></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <button 
            disabled={processes.some(p => p.burst === 0)}
            type="submit">
              Calcular
          </button>
        </form>
      </header>
      <section>
        <header className="carousel-solutions-header">
          <button className="btn-clean"
            
          >Limpiar</button>
        </header>
        <SchedulingCarouselSolutions solutions={solutions} />
      </section>
    </main>
  );
}