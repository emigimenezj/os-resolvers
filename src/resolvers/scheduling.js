import { PROC } from '../constants';

export function resolver({ processes, quantum, type = 'FCFS', preemptive }) {

  processes = processes.map(p => ({
    ...p,
    responseTime: undefined,
    waitingTime: 0,
    originalBurst: p.burst
  }));

  quantum = !quantum ? Infinity : quantum;
  const isPreemptive = preemptive === "preemptive"
  
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
        p.responseTime ??= p.waitingTime;
        execRecord[i].push(PROC.RUNNING);
        return;
      }
      if (!p.burst) {
        execRecord[i].push(PROC.AFTER_EXEC);
        return;
      }
      execRecord[i].push(PROC.WAITING);
      p.waitingTime++;
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
    RR: () => {
      const highestPriorityPresent = Math.min(...CPU.ready.map(p => p.priority));
      const index = CPU.ready.findIndex(p => p.priority === highestPriorityPresent);

      const [next] = CPU.ready.splice(index, 1);
      CPU.running = next;
      CPU.quantum = quantum;
    },
    Priority: () => {
      const highestPriorityPresent = Math.min(...CPU.ready.map(p => p.priority));
      const index = CPU.ready.findIndex(p => p.priority === highestPriorityPresent);

      const [next] = CPU.ready.splice(index, 1);
      CPU.running = next;
      CPU.quantum = quantum;
    },
    SJF: () => {
      const { index } = CPU.ready.reduce((rec, p, index) => {
          if (p.priority < rec.priority) return {...p, index};
          if (p.originalBurst < rec.originalBurst) return {...p, index};
          return rec;
      }, {priority: Infinity, originalBurst: Infinity});

      const [next] = CPU.ready.splice(index, 1);
      CPU.running = next;
      CPU.quantum = quantum;
    },
    SRT: () => {
      const { index } = CPU.ready.reduce((rec, p, index) => {
          if (p.priority < rec.priority) return {...p, index};
          if (p.burst < rec.burst) return {...p, index};
          return rec;
      }, {priority: Infinity, originalBurst: Infinity});

      const [next] = CPU.ready.splice(index, 1);
      CPU.running = next;
      CPU.quantum = quantum;
    }
  }

  while (processes.some(p => p.burst !== 0)) {
    if (CPU.ms >= 1000) break;

    const arrivalProcs = processes.filter(p => p.arrival === CPU.ms);
    CPU.ready.push(...arrivalProcs);

    if (!CPU.running) {
      const hasWaitingProcs = CPU.ready.length;
      if (!hasWaitingProcs) {
        recording();
        CPU.ms++;
        continue;
      }

      //*** SELECTION CRITERIA ***//
      ALGORITHM[type]();

    } else if (type === 'SRT' && arrivalProcs.length){

      const tmp_running = CPU.running;
      const tmp_quantum = CPU.quantum;
      CPU.ready.push(CPU.running);
      CPU.running = null;

      //*** SELECTION CRITERIA ***//
      ALGORITHM[type]();

      if (CPU.running === tmp_running) CPU.quantum = tmp_quantum;
      
    } else if (type === 'Priority' && isPreemptive && arrivalProcs.length) {
      const tmp_running = CPU.running;
      const tmp_quantum = CPU.quantum;
      CPU.ready.push(CPU.running);
      CPU.running = null;

      //*** SELECTION CRITERIA ***//
      ALGORITHM[type]();

      if (CPU.running === tmp_running) CPU.quantum = tmp_quantum;
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