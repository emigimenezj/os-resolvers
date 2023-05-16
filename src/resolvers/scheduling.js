const  PROC = {
  BEFORE_EXEC: 'before',
  RUNNING: 'run',
  WAITING: 'wait',
  CTX_SWITCH: 'switch',
  AFTER_EXEC: 'after'
}

export function resolver({ processes, quantum }) {

  const execRecord = Array.from(Array(processes.length), () => []);

  const CPU = {
    ms: 0,
    running: null,
    ready: [],
    quantum
  }

  while(processes.some(proc => proc.burst !== 0)) {

    processes.forEach((proc, i) => {

      if (proc.arrival < CPU.ms) {
        execRecord[i].push(PROC.BEFORE_EXEC);
        return;
      }

      if (!CPU.ready.includes(proc) && CPU.running !== proc) {
        if (!CPU.running) {
          CPU.running = proc;
          execRecord[i].push(PROC.RUNNING);
          return;
        }
        CPU.ready.push(proc);
        execRecord[i].push(PROC.WAITING);
        return;
      }

      if (!CPU.running) {
          CPU.running = proc;
          proc.burst--;
          execRecord[i].push(PROC.RUNNING);
          return;
      }

      execRecord[i].push(PROC.WAITING);
      return;
    });

    ms++;
  }
}