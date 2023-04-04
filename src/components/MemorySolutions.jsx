export function MemorySolutions({ solutions }) {
  return (
    <>
      {
        solutions.map(({memoryHistory, orderHistory, seq}, i) => {
          return (
            <table key={i}>
              <thead>
                <tr>
                  <th>Petición</th>
                  <th>Memoria</th>
                  <th>Orden de reemplazo</th>
                </tr>
              </thead>
              <tbody>
                {
                  seq.map((page, i) => (
                    <tr key={i}>
                      <td>{page}</td>
                      <td>{...memoryHistory[i]}</td>
                      <td>{...orderHistory[i]}</td>
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