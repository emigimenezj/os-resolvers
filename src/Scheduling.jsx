import { useState } from 'react';

import { SchedulingCarouselSolutions } from './components/SchedulingCarouselSolutions';
import { resolver } from './resolvers/scheduling';

import './styles/scheduling.css';

export function Scheduling() {

  const emptyProcess = { burst: 0, arrival: 0, priority: 0 };

  const [processes, setProcesses] = useState([{...emptyProcess}]);
  const [quantum, setQuantum] = useState('');
  const [solutions, setSolutions] = useState([]);

  const handleChangeProcessesInput = (event) => {
    const { value } = event.target;

    setProcesses(prevProcesses => {
      const newProcesses = [...prevProcesses];
      const relativeLength = value - prevProcesses.length;

      relativeLength < 0
        ? newProcesses.splice(-1)
        : newProcesses.push({...emptyProcess});
      
      return newProcesses;
    });
  }
    
  
  const onTableChange = (event) => {
    console.log(event);
    const { name, value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if (!isOnlyDigits) return;

    setProcesses(prev => {
      const newProc = [...prev];
      const [i, prop] = name.split('-');
      newProc[i][prop] = value ? parseInt(value, 10) : 0;
      return newProc;
    });
  }

  const handleQuantumInput = (event) => {

    const { value } = event.target;

    const isOnlyDigits = /^\d*$/.test(value);
    if (!isOnlyDigits) return;

    setQuantum(value ? parseInt(event.target.value, 10) : 0);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const copyProcesses = [...processes].map(p => ({...p}));
    const sol = resolver({processes: copyProcesses, quantum, type: event.target.algorithm.value });

    setSolutions(prev => [...prev, sol]);

    console.log("Pos submit! :v");
  }

  /*
  TODO:
  - [ ] Validar las actualizaciones de los inputs de scheduling (burst, arrive, priority and quantum)
  (OBS) Cuando se pone un valor y se borra, se envía <empty string> como valor de input, eso rompe el algoritmo y queda en while(true)
  - [+-] Agregar soporte para manejo de prioridades que sea compatible con desalojo por quantums
  - [ ] Averiguar lo de colas multi-nivel y multi-nivel con feedback
  - [+-] Agregar soporte para el cálculo de THROUGHPUT, TURNAROUND, WAITING TIME, RESPONSE TIME
  - [ ] Revisar AGING (aumentar gradualmente la prioridad de procesos que estén esperadno hace mucho)
  */

  return (
    <main>
      <header>
        <h1> Scheduling ! </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="sched-algorithm">Tipo de algoritmo:</label>
          <select id="sched-algorithm" className="select" name="algorithm" defaultValue="FCFS">
            <option value="FCFS">First-Come, First-Serve (FCFS o FIFO)</option>
            <option value="SJF">Shortest-Job-First</option>
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
            value={ quantum ? quantum : '' }
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
                    <th>P{i+1}</th>
                    <td>
                      <input
                        type="text"
                        onChange={onTableChange}
                        name={`${i}-burst`}
                        value={ p.burst ? p.burst : '' }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <input 
                        type="text"
                        disabled={!p.burst}
                        onChange={onTableChange}
                        name={`${i}-arrival`}
                        value={ p.arrival ? p.arrival : '' }
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        disabled={!p.burst}
                        onChange={onTableChange}
                        name={`${i}-priority`}
                        value={ p.priority ? p.priority : '' }
                        placeholder="0"
                      />
                    </td>
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
          <button onClick={() => setSolutions([])} className="btn-clean"
            
          >Limpiar</button>
        </header>
        <SchedulingCarouselSolutions solutions={solutions} />
      </section>
    </main>
  );
}