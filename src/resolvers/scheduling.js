import { PROC } from '../constants';

export function resolver({ processes, quantum, type = 'FCFS' }) {

  if (type === 'SJF')
    processes = processes.map(p => ({...p, originalBurst: p.burst}));

  quantum = !quantum ? Infinity : quantum;
  
  const execRecord = Array.from(Array(processes.length), () => []);

  const CPU = {
    ms: 0,
    running: null,
    ready: [],
    quantum
  }

  const recording = () => {
    processes.forEach((p, i) => {
      if (CPU.ms < p.arrival) {
        execRecord[i].push(PROC.BEFORE_EXEC);
        return;
      }
      if (CPU.running === p) {
        execRecord[i].push(PROC.RUNNING);
        return;
      }
      if (!p.burst) {
        execRecord[i].push(PROC.AFTER_EXEC);
        return;
      }
      execRecord[i].push(PROC.WAITING);
    });
  }

  const ALGORITHM = {
    FCFS: () => {
      const highestPriorityPresent = Math.min(...CPU.ready.map(p => p.priority));
      const index = CPU.ready.findIndex(p => p.priority === highestPriorityPresent);

      const [next] = CPU.ready.splice(index, 1);
      CPU.running = next;
      CPU.quantum = quantum;
    },
    SJF: () => {      
      const originalBursts = CPU.ready.map(p => p.originalBurst);
      const targetBurst = Math.min(...originalBursts);

      const index = CPU.ready.findIndex(p => p.originalBurst === targetBurst);
      const [next] = CPU.ready.splice(index, 1);
      CPU.running = next;
      CPU.quantum = quantum;
    }
  }

  while (processes.some(p => p.burst !== 0)) {
    if (CPU.ms >= 1000) break;

    console.log("hola?");

    const arrivalProcess = processes.filter(p => p.arrival === CPU.ms);
    CPU.ready = CPU.ready.concat(arrivalProcess);

    if (!CPU.running) {
      const hasWaitingProcess = CPU.ready.length;
      if (!hasWaitingProcess) {
        recording();
        CPU.ms++;
        continue;
      }

      //*** SELECTION CRITERIA ***//
      ALGORITHM[type]();
    }

    recording();

    CPU.running.burst--;
    CPU.quantum--;

    const hasQuantum = CPU.quantum !== 0;
    const hasBurst = CPU.running.burst !== 0;
    if (!hasQuantum || !hasBurst) {
      if (hasBurst) CPU.ready.push(CPU.running)
      CPU.running = null;
    }

    CPU.ms++;
  }

  execRecord.forEach(rec => rec.push(PROC.AFTER_EXEC));

  return {
    execRecord,
    processes,
    quantum
  };
}