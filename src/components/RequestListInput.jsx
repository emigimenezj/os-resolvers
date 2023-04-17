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

    setMemoryRequestSequence(prevPages => {
      
      const newPages = [...prevPages];

      const isOnlyDigits = /^\d*$/.test(value);
      if (isOnlyDigits) {
        newPages[index] = value ? parseInt(value, 10) : value;
        return newPages;  
      };
      
      const isCopyPaste = /^\s*\d+\s*\d*\s*(,\s*\d+\s*\d*\s*)+$/.test(value);
      if (isCopyPaste) {
        const parsedPages = value.match(/\d+/g).map(page => parseInt(page, 10));

        const newRefs = [...parsedPages].fill(null);
        inputRefs.current.concat(newRefs);

        newPages[index] = parsedPages.shift();
        newPages.splice(index+1, 0, ...parsedPages);

        return newPages;
      }
      
      return prevPages;
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
      setMemoryRequestSequence(prevPages => {
        const index = inputRefs.current.findIndex(el => el === document.activeElement);
        const newSequence = [...prevPages];
        newSequence.splice(index+1, 0, '');
        return newSequence;
      });
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

    const nonEmptyInputs = inputRefs.current.filter(Boolean);
    const outOfRangeInputs = nonEmptyInputs.filter(({value}) => value > pages);

    const errorMsg = pages
      ? `Hay páginas fuera de rango. El máximo rango es ${pages}.`
      : `Por favor, ingresá una cantidad de páginas válida.`

    return (
      <>
        {
          outOfRangeInputs.length
            ? <div style={{color: 'red'}}>{errorMsg}</div>
            : null
        }
      </>
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
            className={`sequence-request-input ${page > pages ? 'out-of-range' : ''}`}
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