import './App.css';
import * as React from 'react';
import { useState } from "react";

export default function App() {
  const [inpVal, setInpVal] = useState('');
  const [result, setResult] = useState('');

  /** 
    Function to handle change of input value
    @param event 
  */
  function handleChange(event) {
    setInpVal(event.target.value);
  };

  /**
    Submit function to add for string calculator
  */
  function onSubmitCal() {
    // For empty input return 0
    if (!inpVal) {
      setResult(0);
      return;
    }

    // Check for custom delimeters
    let checkDelimeters = inpVal.substring(0, inpVal.indexOf("\\n"));
    let delimeter = ","; // default delimeter
    let delimeters = []; // array if multiple delimeter are added 

    if (checkDelimeters.slice(0, 2) === "//") {
      delimeter = checkDelimeters.replace("//", "");
      let index = 0;

      // Get all multiple delimeters 
      for (let i = 0; i < delimeter.length; i++) {
        if (delimeter[i] === delimeter[i + 1]) {
          continue;
        } else {
          delimeters.push(delimeter.substring(index, i + 1));
          index = i + 1;
        }
      }
      delimeter = delimeters.join("|");
      // Escape special chars for regex
      delimeter = delimeter.replace(/[-[\]{}()*+?.,\\^$#\s]/g, '\\$&');
    }

    const splitDelimeters = new RegExp(`\n|` + delimeter);
    let valArr; // Array of values after spliting using delimeters

    if (delimeter !== ",") {
      const newInp = inpVal.substring(inpVal.indexOf("\\n") + 2);
      valArr = newInp.split(splitDelimeters);
    } else {
      valArr = inpVal.split(/\\n|,/);
    }

    // If an Array contains an valid and empty value both
    if (valArr.includes("")) {
      setResult("Expression not supported");
      return;
    }

    // When there is only one input
    if (valArr.length === 1) {
      // Number input
      if (!isNaN(valArr[0])) {
        if (valArr[0] < 0) {
          // Negative number
          setResult("Negative numbers are not allowed " + parseInt(valArr[0]));
        } else if (valArr[0] > 1000) {
          // Integer Number greater than 1000
          setResult(0);
        } else {
          // Integer Number less than 1000
          setResult(parseInt(valArr[0]));
        }
      } else if (isNaN(valArr[0])) {
        // Input apart from number
        setResult("Expression not supported");
      }
    } else {
      let expNotSuppported = false;
      let exception = false; // Boolean when negative number in string
      let getNegativeNums = [];
      let sum = 0;
      // Incase of multiple data string
      for (let i = 0; i < valArr.length; i++) {
        if (valArr[i] < 0 && !isNaN(valArr[i])) {
          // Negative number
          exception = true;
          getNegativeNums.push(parseInt(valArr[i]));
        } else if (!isNaN(valArr[i]) && valArr[i] > 0 && !exception && valArr[i] < 1000) {
          // Integer Number less than 1000
          sum += parseInt(valArr[i]);
        } else if (isNaN(valArr[i])) {
          // Input apart from number
          expNotSuppported = true;
          break;
        }
      }
      expNotSuppported ? setResult("Expression not supported") : (exception ? setResult("Negative numbers are not allowed " + getNegativeNums) : setResult(sum));
    }
  }

  return (
    <div className="App" data-testid="stringCal">
      <header className="App-header">
        <h1>String Calculator</h1>
      </header>
      <div>
        <input type="text" value={inpVal} onChange={handleChange} />
        <button onClick={() => onSubmitCal()} > Submit </button>
        <p className='result'>
          Calculator Output : <span data-testid="calResult">{result}</span>
        </p>
      </div>
    </div>
  );
};
