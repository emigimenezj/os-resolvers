export function MemorySolutions({ solutions, frames }) {

  return (
    <>
      {
        solutions.map(({memoryHistory, orderHistory, seq}, i) => {
          return (
            <table key={i}>
              <thead>
                <tr>
                  <th>Peticiones</th>
                  <th colSpan={frames}>Historial de memoria</th>
                  <th colSpan={frames}>Historial de orden</th>
                </tr>
              </thead>
              <tbody>
                {
                  seq.map((page, i) => (
                    <tr key={i}>
                      <td>{page}</td>
                      {
                        memoryHistory[i].map((page, i) => <td key={i}>{page}</td>)
                      }
                      {
                        orderHistory[i].map((page, i) => <td key={i}>{page}</td>)
                      }
                    </tr>
                  ))
                }
              </tbody>
            </table>
          );
        })
      }
    </>
  );
}