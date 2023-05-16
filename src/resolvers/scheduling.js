const PROC = {
  BEFORE_EXEC: 'B',
  RUNNING: 'R',
  WAITING: 'W',
  CTX_SWITCH: 'switch',
  AFTER_EXEC: 'A'
}

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

  while (processes.some(p => p.burst !== 0)) {

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
      const [next] = CPU.ready.splice(0, 1);
      CPU.running = next;
    }

    recording();

    CPU.running.burst--;
    if (!CPU.running.burst) {
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