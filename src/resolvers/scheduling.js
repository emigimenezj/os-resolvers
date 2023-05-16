import { PROC } from '../constants';

export function resolver({ processes, quantum }) {

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
      const [next] = CPU.ready.splice(0, 1);
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
    // TODO: quantum

    CPU.ms++;
  }

  execRecord.forEach(rec => rec.push(PROC.AFTER_EXEC));

  return {
    execRecord,
    processes,
    quantum
  };
}