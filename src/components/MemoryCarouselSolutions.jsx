import { MemorySolution } from './MemorySolution';

export function MemoryCarouselSolutions({ solutions }) {

  const mcd = (a, b) => b === 0 ? a : mcd(b, a % b);

  return (
    <div className="carousel-solutions-container">
      {
        solutions.map((sol, index) => {
          const { hitsRecord } = sol;

          const totalHits = hitsRecord.filter(Boolean).length;
          const totalMisses = hitsRecord.length - totalHits;

          const m = mcd(totalHits, totalMisses);
          const simplifiedFrac = `${totalHits / m} / ${totalMisses / m}`;

          const hitRate = totalHits
            ? simplifiedFrac
            : 0;
          const hitRateAprox = totalHits
            ? (totalHits/totalMisses).toFixed(3).replace(/0+$/, '')
            : '0.0';

          return (
            <div key={index} className="solution-container fade-in">
              <table>
                <thead>
                  <tr>
                    <th>PÁG.</th>
                    <th colSpan={sol.frames}>MEMORIA</th>
                    <th colSpan={sol.frames}>ORDEN</th>
                  </tr>
                </thead>
                <tbody>
                  <MemorySolution solution={sol} />
                </tbody>
              </table>
              <div>HITS: {totalHits}</div>
              <div>MISSES: {totalMisses}</div>
              <div>HIT RATE: {hitRate} ~ ({hitRateAprox})</div>
            </div>
          );
        })
      }
    </div>
  );
}