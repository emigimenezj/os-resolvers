import { PROC } from '../constants';

const SLOT_TYPE = {
  [PROC.AFTER_EXEC]: 'sched-sol-after-exec',
  [PROC.BEFORE_EXEC]: 'sched-sol-before-exec',
  [PROC.WAITING]: 'sched-sol-waiting',
  [PROC.RUNNING]: 'sched-sol-running'
}

export function SchedulingCarouselSolutions({ solutions }) {
  
  const mcd = (a, b) => b === 0 ? a : mcd(b, a % b);

  return (
    <div className="carousel-solutions-container">
      {
        solutions.map((sol, index) => {

          const { processes, quantum, execRecord: [{length}] } = sol;

          const responseSum = processes.reduce((rec, {responseTime}) => rec + responseTime, 0);
          const waitingSum = processes.reduce((rec, {waitingTime}) => rec + waitingTime, 0);
          const turnaroundSum = processes.reduce((rec, {originalBurst, waitingTime}) => rec + originalBurst + waitingTime, 0);
          const totalProc = processes.length;

          const rm = mcd(responseSum, totalProc);
          const responseTimeFrac = responseSum ? `${responseSum / rm} / ${totalProc / rm}` : 0;
          const responseTimeDec = responseSum ? (responseSum/totalProc).toFixed(3).replace(/\.?0+$/, '') : '0.0';

          const wm = mcd(waitingSum, totalProc);
          const waitingTimeFrac = waitingSum ? `${waitingSum / wm} / ${totalProc / wm}` : 0;
          const waitingTimeDec = waitingSum ? (waitingSum/totalProc).toFixed(3).replace(/\.?0+$/, '') : '0.0';

          const tm = mcd(turnaroundSum, totalProc);
          const turnaroundFrac = turnaroundSum ? `${turnaroundSum / tm} / ${totalProc / tm}` : 0;
          const turnaroundDec = turnaroundSum ? (turnaroundSum/totalProc).toFixed(3).replace(/\.?0+$/, '') : '0.0';

          return (
            <div key={index} className="solution-container">
              <div>
                {
                  quantum === Infinity
                    ? ''
                    : <span>Quantum: {quantum} </span>
                }
                <span>Average times:</span>
                <span> RESPONSE = {responseTimeFrac} ~ ({responseTimeDec})</span>
                <span> WAITING = {waitingTimeFrac} ~ ({waitingTimeDec})</span>
                <span> TURNAROUND = {turnaroundFrac} ~ ({turnaroundDec})</span>
              </div>
              <div className="sched-sol-table">
                <table>
                  <tbody>
                    {
                      sol.execRecord.map((rec, i) => {
                        return (
                          <tr key={i} className="sched-sol-row">
                            <th key={i}>{`P${i+1}`}</th>
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
                      <td></td>
                      {Array.from({length}).map((_, i) => <td key={i}>{i}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      }
    </div>
  )
}