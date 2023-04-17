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
  MEM_HIT: (id, hits) => `La página ${id} estaba en memoria, por lo que genera un hit\nTotal de hits: ${hits}`,
  MEM_MISS: (id, misses) => `Se genera un miss porque la página ${id} no estaba en memoria\nTotal de misses: ${misses}`,
  MEM_NORMAL: (id) => `La página ${id} está en memoria y no fue afectada por ningún cambio`,
  MEM_EMPTY: `Esta ranura representa un espacio de memoria vacío`,
  ORD_FIRST: (id) => `La próxima página en ser desalojada será la ${id}`,
  SC_ORD_FIRST: (id) => `Con el próximo miss, la página ${id} perderá su segunda oportunidad y se deslpazará al final del orden de desalojo`,
  LRU_ORD_HIT: (id) => `Al haber generado un hit, la página ${id} se desplaza al final del orden de desalojo`,
  SC_ORD_HIT: (id) => `La página ${id} obtiene una segunda oportunidad por haber generado un hit`,
  ORD_MISS: (id) => `La página ${id} se agrega al final del orden de desalojo`,
  ORD_NORMAL: (id) => `Este es el orden de desalojo para la página ${id}\nCuando esté primera, será la siguiente en ser desalojada`,
  SC_ORD_NORMAL: (id) => `La página ${id} tiene una segunda oportunidad\nCuando esté primera, no será desalojada`,
  ORD_EMPTY: `Esta ranura representa un espacio de orden disponible`,
}

export function MemorySolution({ solution }) {

  const {
    requestSequence,
    memoryRecord,
    orderRecord,
    scRecord,
    hitsRecord,
    type
  } = solution;

  return (
    <>
      {
        requestSequence.map((pageRequested, i) => (
          <tr key={i} className="mem-sol-row">
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
                const hasSecondChance = scRecord[i].includes(page)
                const firstOrderMessage = MESSAGES[`${hasSecondChance ? 'SC_' : ''}ORD_FIRST`](page);
                const hitOrderMessage = {
                  LRU: MESSAGES.LRU_ORD_HIT,
                  SC: MESSAGES.SC_ORD_HIT
                }
                const normalOrderMessage = MESSAGES[`${hasSecondChance ? 'SC_' : ''}ORD_NORMAL`](page);
                const bg = hasSecondChance ? 'yellow' : null;

                if (page === pageRequested) {
                  if (hitsRecord[i] && /LRU|SC/.test(type))
                    return <Slot key={j} content={page} msg={hitOrderMessage[type](page)} bg={bg} className={'order-slot'} />
                  if (!hitsRecord[i])
                    return <Slot key={j} content={page} msg={MESSAGES.ORD_MISS(page)} bg={bg} className={'order-slot'} />                
                }

                if (j === 0)
                  return <Slot key={j} content={page} msg={firstOrderMessage} bg={bg} className={'order-slot'} />

                return page
                  ? <Slot key={j} content={page} msg={normalOrderMessage} bg={bg} className={'order-slot'} />
                  : <Slot key={j} content={page} msg={MESSAGES.ORD_EMPTY} className={'order-slot'} /> 
              })
            }
          </tr>
        ))
      }
    </>
  );
}