export function resolver({ memoryRequestSequence, frames }) {

  const memoryRecord = [];
  const orderRecord = [];

  const hitsRecord = [...memoryRequestSequence].fill(false);

  memoryRequestSequence.forEach((page, i) => {

    const memory = i === 0 ? Array(frames).fill(null) : [...memoryRecord.at(-1)];
    const order = i === 0 ? Array(frames).fill(null) : [...orderRecord.at(-1)];

    if (memory.includes(page)) {
      memoryRecord.push(memory);
      orderRecord.push(order);

      hitsRecord[i] = true;
      return
    }

    const firstEmptySpace = memory.findIndex(space => space === null);
    const hasAvailableMemory = firstEmptySpace !== -1;
    if (hasAvailableMemory) {
      memory[firstEmptySpace] = page;
      order[firstEmptySpace] = page;

      memoryRecord.push(memory);
      orderRecord.push(order);
      return;
    }
    
    const [pageToReplace] = order;
    const pageIndexToReplace = memory.findIndex(page => page === pageToReplace);

    memory.splice(pageIndexToReplace, 1, page);
    order.shift();
    order.push(page);

    memoryRecord.push(memory);
    orderRecord.push(order);
  });

  return { memoryRecord, orderRecord, hitsRecord };
}