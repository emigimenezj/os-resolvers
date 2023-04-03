import { useRef, useState } from "react";

export function Memory() {

  // cantidad de marcos: 4
  // cantidad de páginas: 6
  // lista de peticiones: 1, 2, 1, 3, 4, 3, 5, 6, 2

  const [numInputs, setNumInputs] = useState(1);
  const [otp, setOtp] = useState(Array(numInputs).fill(''));
  const inputRefs = useRef(Array(numInputs).fill(null));



  function handleChange(index, event) {
    const value = event.target.value;
    const isOnlyDigits = /^\d+$/.test(value)

    if(!isOnlyDigits) return;

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });
    if (value && index < numInputs - 1) {
      inputRefs.current[index + 1].focus();
    }
    if (value === ' ' && index < numInputs - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      setNumInputs((prevNumInputs) => prevNumInputs - 1);
      setOtp((prevOtp) => (prevOtp.pop(), prevOtp));
      inputRefs.current.pop();
      inputRefs.current[index - 1].focus();
    }
    if(event.key === ' ' && event.target.value !== '') {
      console.log(`Agregando nuevo campo...[${event.target.value}] en [${index}]`);
      handleAddInput(index);
    }
  }

  function handleAddInput(index) {
    if ( /* index === numInputs - 1 */ true) {
      setNumInputs((prevNumInputs) => prevNumInputs + 1);
      setOtp((prevOtp) => [...prevOtp, '']);
      inputRefs.current.push(null);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const code = otp.join('').replace(/\s/g, '');
    console.log('El código ingresado es:', code);
    // Lógica para validar y enviar el código
  }

  return (
    <section>
      <header>
        <h1>Memory!</h1>
        <form onSubmit={handleSubmit}>
          <label>Por favor ingresa el código que te enviamos:</label>
          <div className="otp-input">
            {otp.slice(0, numInputs).map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                //onFocus={() => handleAddInput(index)}
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