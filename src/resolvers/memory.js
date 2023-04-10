export function resolver({ memoryRequestSequence, frames, type = 'FIFO' }) {

  const memoryRecord = [];
  const orderRecord = [];
  const scRecord = [];

  const hitsRecord = [...memoryRequestSequence].fill(false);

  const formatRecord = (record) => {
    for (const rd of record) {
      if (rd.length !== frames) {
        const start = rd.length;
        rd.length = frames;
        rd.fill(null, start);
      }
    }
  }

  memoryRequestSequence.forEach((page, i) => {

    const memory = i === 0 ? [] : [...memoryRecord.at(-1)];
    const order = i === 0 ? [] : [...orderRecord.at(-1)];
    const sc = i === 0 ? [] : [...scRecord.at(-1)];

    if (memory.includes(page)) {

      if (type === 'LRU') {
        const index = order.findIndex(p => p === page);
        order.splice(index, 1);
        order.push(page)
      }

      if (type === 'SC') sc.push(page);

      memoryRecord.push(memory);
      orderRecord.push(order);
      scRecord.push(sc);

      hitsRecord[i] = true;
      return
    }

    const hasAvailableMemory = memory.length < frames;
    if (hasAvailableMemory) {
      memory.push(page)
      order.push(page)

      memoryRecord.push(memory);
      orderRecord.push(order);
      scRecord.push(sc);
      return;
    }
    
    while (sc.includes(order[0]))
      (sc.splice(sc.findIndex(p => p === order[0]), 1), order.push(order.shift()))

    const [pageToReplace] = order;
    const pageIndexToReplace = memory.findIndex(page => page === pageToReplace);

    memory.splice(pageIndexToReplace, 1, page);
    order.shift();
    order.push(page);

    memoryRecord.push(memory);
    orderRecord.push(order);
    scRecord.push(sc);
  });

  formatRecord(memoryRecord);
  formatRecord(orderRecord);

  return {
    requestSequence: memoryRequestSequence,
    memoryRecord,
    orderRecord,
    scRecord,
    hitsRecord,
    frames,
    type
  };
}