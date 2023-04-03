import { useRef, useState } from 'react';

export function Memory() {

  // cantidad de marcos: 4
  // cantidad de páginas: 6            
  // lista de peticiones: 1, 2, 1, 3, 4, 3, 5, 6, 2

  const [pages, setPages] = useState('');
  const [frames, setFrames] = useState('');

  const [pageNumbers, setPageNumbers] = useState(['']);
  const inputRefs = useRef([null]);

  const handleChange = (index, event) => {
    const { value } = event.target;

    if(value === ' ') return;

    if(value.at(-1) === ' ' && index < pageNumbers.length - 1)
      inputRefs.current[index + 1].focus();
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;

    setPageNumbers((prevPages) => {
      const newPages = [...prevPages];
      newPages[index] = value;
      return newPages;
    });
  }

  const handleKeyDown = (index, event) => {
    console.log(inputRefs.current.length, pageNumbers.length)
    if (event.key === 'Backspace' && !pageNumbers[index] && index > 0) {
      event.preventDefault();
      setPageNumbers((prevPages) => {
        const newPages = [...prevPages];
        newPages.pop();
        return newPages;
      });
      inputRefs.current.pop();
      inputRefs.current[index - 1].focus();
    }
    if (event.key === ' ' && event.target.value) {
      setPageNumbers((prevPages) => [...prevPages, '']);
      inputRefs.current.push(null);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const code = pageNumbers.join('').replace(/\s/g, '');
    console.log('El código ingresado es:', code);
  }

  const handleChangePageInput = (event) => {
    const { value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;
    
    setPages(value);
  }

  const handleChangeFrameInput = (event) => {
    const { value } = event.target;
    
    const isOnlyDigits = /^\d*$/.test(value);
    if(!isOnlyDigits) return;
    
    setFrames(value);
  }

  return (
    <section>
      <header>
        <h1>Memory!</h1>
        <form onSubmit={handleSubmit}>
          <label>Cantidad de páginas:</label>
          <input onChange={handleChangePageInput} type="text" value={pages} />
          <br />
          <label>Cantidad de marcos de página (frames):</label>
          <input onChange={handleChangeFrameInput} type="text" value={frames} />
          <br />
          <label>Ingresá la lista de peticiones de memoria:</label>
          <div className="otp-input">
            {pageNumbers.map((digit, index) => (
              <input
                disabled={pages && frames ? false : true}
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