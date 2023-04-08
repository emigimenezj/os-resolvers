import { MemorySolution } from './MemorySolution';

export function MemoryCarouselSolutions({ solutions }) {

  return (
    <>
      {
        solutions.map((sol, index) => {
          return (
            <table key={index}>
              <thead>
                <tr>
                  <th>Peticiones</th>
                  <th colSpan={sol.frames}>Registro de memoria</th>
                  <th colSpan={sol.frames}>Registro de orden</th>
                </tr>
              </thead>
              <MemorySolution solution={sol} />
            </table>
          );
        })
      }
    </>
  );
}