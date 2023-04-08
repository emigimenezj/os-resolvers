import { Slot } from './Slot';

/*
MENSAJES QUE QUIERO QUE HAYA:

--- GENERALES ---
✅[REQUEST] página requesteada
✅[HIT] página que generó un acierto
✅[MISS] página que generó un fallo
✅[MEM] [NORMAL] página a la que no le pasó nada y queda igual que antes
✅[MEM] [VACÍO] slot vacío que representa memoria vacía
✅[ORD] [NORMAL] página que está en el orden de reemplazo
✅[ORD] [PRIMERO] página que será reemplazada en el próximo miss (***OJO CON SECOND CHANCE***)
✅[ORD] [VACÍO] slot vacío que representa un puesto de orden vacío
✅[ORD] [MISS] página que se agrega al final del orden de reemplazo

--- ESPECÍFICOS ---
-- LRU
✅[ORD] [HIT] página del final que se fue al final por LRU
-- SECOND CHANCE
✅[ORD] [SC] página con second chance desde antes
✅[ORD] [HIT] [SC] página que obtuvo second chance porque hubo un HIT
✅[ORD] [MISS] [SC] página que perdió su second chance y se fue al final
*/
const MESSAGES = {
  REQUEST: (id) => `Se recibe una petición en memoria para la página ${id}`,
  MEM_HIT: (id, hits) => `La página ${id} estaba en memoria, por lo que genera un hit.\nTotal de hits: ${hits}`,
  MEM_MISS: (id, misses) => `La página ${id} no estaba en memoria, por lo que genera un miss.\nTotal de misses: ${misses}`,
  MEM_NORMAL: (id) => `La página ${id} está en memoria y no fue afectada por ningún cambio`,
  MEM_EMPTY: `Esta ranura representa un espacio de memoria vacío`,
  ORD_FIRST: (id) => `La página ${id} será la próxima en ser desalojada`,
  ORD_MISS: (id) => `La página ${id} se agrega al final del orden de desalojo`,
  ORD_NORMAL: (id) => `Este es el orden de desalojo de la página ${id}.\nCuando esté primera, será la siguiente en ser desalojada`,
  ORD_EMPTY: `Esta ranura representa un espacio de orden disponible`,
  LRU_ORD_HIT: (id) => `Al haber generado un hit, la página ${id} se desplaza al final del orden de desalojo`,
  SC_ORD: (id) => `La página ${id} no será desalojada caso de generar un miss`,
  SC_ORD_HIT: (id) => `La página ${id} obtiene una segunda oportunidad por haber generado un hit`,
  SC_ORD_MISS: (id) => `Al perder su segunda oportunidad, la página ${id} se desplaza al final del orden de desalojo`
}

export function MemorySolution({ solution }) {

  const { memoryRecord, orderRecord, hitsRecord, requestSequence } = solution;

  return (
    <tbody>
      {
        requestSequence.map((pageRequested, i) => (
          <tr key={i}>
            <Slot content={pageRequested} msg={MESSAGES.REQUEST(pageRequested)} />
            {
              memoryRecord[i].map((page, j) => {
                if (page === pageRequested) {

                  const hits = hitsRecord.slice(0, i+1).filter(Boolean).length;
                  const misses = i - hits + 1;

                  return hitsRecord[i]
                    ? <Slot key={j} content={page} msg={MESSAGES.MEM_HIT(page, hits)} bg={'green'} />
                    : <Slot key={j} content={page} msg={MESSAGES.MEM_MISS(page, misses)} bg={'red'} />
                }
                return page
                  ? <Slot key={j} content={page} msg={MESSAGES.MEM_NORMAL(page)} />
                  : <Slot key={j} content={page} msg={MESSAGES.MEM_EMPTY} />
              })
            }
            {
              orderRecord[i].map((page, j) => {
                if (page === pageRequested && !hitsRecord[i])
                  return <Slot key={j} content={page} msg={MESSAGES.ORD_MISS(page)} />
                
                if (j === 0)
                  return <Slot key={j} content={page} msg={MESSAGES.ORD_FIRST(page)} />
                
                return page
                  ? <Slot key={j} content={page} msg={MESSAGES.ORD_NORMAL(page)} />
                  : <Slot key={j} content={page} msg={MESSAGES.ORD_EMPTY} />
              })
            }
          </tr>
        ))
      }
    </tbody>
  );
}