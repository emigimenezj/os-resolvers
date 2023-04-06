import { useRef } from 'react';

export function RequestListInput({
  pages,
  frames,
  memoryRequestSequence,
  setMemoryRequestSequence
}) {

  const inputRefs = useRef([null]);

  const handleChange = (index, event) => {
    const { value } = event.target;

    if(value === ' ') return;

    if(value.at(-1) === ' ' && index < memoryRequestSequence.length - 1)
      inputRefs.current[index + 1].focus();
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;

    setMemoryRequestSequence((prevPages) => {
      const newPages = [...prevPages];
      newPages[index] = value ? parseInt(value, 10) : value;
      return newPages;
    });
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !memoryRequestSequence[index] && index > 0) {
      event.preventDefault();
      setMemoryRequestSequence((prevPages) => {
        const newPages = [...prevPages];
        newPages.pop();
        return newPages;
      });
      inputRefs.current.pop();
      inputRefs.current[index - 1].focus();
      return;
    }
    if (event.key === ' ' && event.target.value) {
      setMemoryRequestSequence((prevPages) => [...prevPages, '']);
      inputRefs.current.push(null);
    }
    
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      inputRefs.current[Math.max(0, index-1)].focus();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const maxIndex = inputRefs.current.filter(Boolean).length-1; // filter(Boolean) porque useRef([null]) deja un null al hacerle .pop() // por qué?
      inputRefs.current[Math.min(maxIndex, index+1)].focus();
    }
  }

  const handleError = () => {
    const badPages = memoryRequestSequence.filter(page => page > pages);

    return (
      <div style={{color: 'red'}}>
        {
          badPages.map((p, i) => <p key={i}>La página {p} está fuera de rango.</p>)
        }
      </div>
    );
  }

  return (
    <>
      <label>Ingresá la lista de peticiones de memoria:</label>
      <div className="pages-numbers-inputs-container">
        {memoryRequestSequence.map((page, index) => (
          <input
            disabled={!pages || !frames}
            key={index}
            type="text"
            value={page}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
        {handleError()}
      </div>
    </>
  );
}