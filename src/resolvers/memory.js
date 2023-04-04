export function resolver({ memoryRequestSequence, frames }) {

  const memoryHistory = [];
  const orderHistory = [];

  let hits = 0;
  let misses = 0;

  memoryRequestSequence.forEach((page, i) => {
    if (i === 0) {
      memoryHistory.push([page]);
      orderHistory.push([page]);
      misses++;
      return;
    }

    const memory = [...memoryHistory.at(-1)];
    const order = [...orderHistory.at(-1)];

    if (memory.includes(page)) {
      memoryHistory.push(memory);
      orderHistory.push(order);
      hits++;
      return;
    }

    const hasAvailableMemory = memory.length < frames;
    if (hasAvailableMemory) {
      memoryHistory.push(memory.concat(page));
      orderHistory.push(order.concat(page));
      misses++;
      return;
    }
    
    const [pageToReplace] = order;
    const pageIndexToReplace = memory.findIndex(page => page === pageToReplace);

    memory.splice(pageIndexToReplace, 1, page);
    order.shift();
    order.push(page);

    memoryHistory.push(memory);
    orderHistory.push(order);
    
    misses++;
  });

  return { memoryHistory, orderHistory, hits, misses };
}