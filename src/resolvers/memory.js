export function resolver({ memoryRequestSequence, frames }) {

  const memoryHistory = [];
  const orderHistory = [];

  let hits = 0;
  let misses = 0;

  memoryRequestSequence.forEach((page, i) => {
    if (i === 0) {
      const memory = Array(frames).fill(null);
      const order = Array(frames).fill(null);
      memory[0] = page;
      order[0] = page;

      memoryHistory.push(memory);
      orderHistory.push(order);
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

    const firstEmptySpace = memory.findIndex(space => space === null);
    const hasAvailableMemory = firstEmptySpace !== -1;
    if (hasAvailableMemory) {

      memory[firstEmptySpace] = page;
      order[firstEmptySpace] = page;

      memoryHistory.push(memory);
      orderHistory.push(order);
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