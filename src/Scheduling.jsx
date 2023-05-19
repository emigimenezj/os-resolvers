import { useState } from 'react';

import { resolver } from './resolvers/scheduling';
import { PROC } from './constants';

import './styles/scheduling.css';

const SLOT_TYPE = {
  [PROC.AFTER_EXEC]: 'sched-sol-after-exec',
  [PROC.BEFORE_EXEC]: 'sched-sol-before-exec',
  [PROC.WAITING]: 'sched-sol-waiting',
  [PROC.RUNNING]: 'sched-sol-running'
}

export function SchedulingCarouselSolutions({ solutions }) {
  return (
    <div className="carousel-solutions-container">
      {
        solutions.map((sol, index) => {
          return (
            <div key={index} className="solutioncontainer">
              <table>
                <thead>
                  <tr>
                    {sol.execRecord.map((_, i) => <th key={i}>{`P${i+1}`}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {
                    sol.execRecord.map((rec, i) => {
                      return (
                        <tr key={i} className="sched-sol-row">
                          {
                            rec.map((slot, j) => {
                              return (
                                <td key={j} className={`sched-sol-slot ${SLOT_TYPE[slot]}`}></td>
                              );
                            })
                          }
                        </tr>
                      );
                    })
                  }
                  <tr className="sched-sol-ms-row">
                    {sol.execRecord[0].map((_, i) => <td key={i}>{i}</td>)}
                  </tr>
                </tbody>
              </table>
              <p>Average waiting time: {sol.averageWaitingTime}</p>
            </div>
          );
        })
      }
    </div>
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
      console.log(event.target.value);
      newProc[i][prop] = parseInt(event.target.value, 10);
      return newProc;
    });
  }

  const handleQuantumInput = (event) => setQuantum(parseInt(event.target.value, 10))

  const handleSubmit = (event) => {
    event.preventDefault();

    const copyProcesses = [...processes].map(p => ({...p}));
    const sol = resolver({processes: copyProcesses, quantum, type: event.target.algorithm.value });

    setSolutions(prev => [...prev, sol]);

    console.log("Pos submit! :v");
  }

  /*
  TODO:
  - [ ]Validar las actualizaciones de los inputs de scheduling (burst, arrive, priority and quantum)
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
          <button onClick={() => setSolutions([])} className="btn-clean"
            
          >Limpiar</button>
        </header>
        <SchedulingCarouselSolutions solutions={solutions} />
      </section>
    </main>
  );
}