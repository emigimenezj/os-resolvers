import { useRef, useState } from 'react';

export function Memory() {

  // cantidad de marcos: 4
  // cantidad de páginas: 6            
  // lista de peticiones: 1, 2, 1, 3, 4, 3, 5, 6, 2

  const [numInputs, setNumInputs] = useState(3);
  const [pageNumbers, setPageNumbers] = useState(Array(numInputs).fill(''));
  const inputRefs = useRef(Array(numInputs).fill(null));

  function handleChange(index, event) {
    const { value } = event.target;

    if(value === ' ') return;

    if(value.at(-1) === ' ' && index < numInputs - 1)
      inputRefs.current[index + 1].focus();
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;

    setPageNumbers((prevPages) => {
      const newPages = [...prevPages];
      newPages[index] = value;
      return newPages;
    });
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !pageNumbers[index] && index > 0) {
      event.preventDefault();
      setNumInputs((prevNumInputs) => prevNumInputs - 1);
      setPageNumbers((prevPages) => (prevPages.pop(), prevPages));
      inputRefs.current.pop();
      inputRefs.current[index - 1].focus();
    }
    if (event.key === ' ' && event.target.value) {
      setNumInputs((prevNumInputs) => prevNumInputs + 1);
      setPageNumbers((prevPages) => [...prevPages, '']);
      inputRefs.current.push(null);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const code = pageNumbers.join('').replace(/\s/g, '');
    console.log('El código ingresado es:', code);
  }

  return (
    <section>
      <header>
        <h1>Memory!</h1>
        <form onSubmit={handleSubmit}>
          <label>Por favor ingresa el código que te enviamos:</label>
          <div className="otp-input">
            {pageNumbers.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button type="submit">Enviar</button>
        </form>
      </header>
    </section>
  );
}