"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styles from "./chooseNumbersComp.module.css";

interface IChooseNumbersComp {
  numbersToRender: number; // The total numbers to render
  selectionLimit: number; // The maximum number of selections allowed
  numbersArr: string[]; // The current selected numbers
  numbersArrSetter: React.Dispatch<React.SetStateAction<string[]>>; // Setter function for updating selected numbers
}

const ChooseNumbersComp = ({
  numbersToRender,
  selectionLimit,
  numbersArr,
  numbersArrSetter,
}: IChooseNumbersComp) => {
  let arrNums: string[] = [];

  // Function to handle number selection
  const addNumberToSelection = (selectedNumber: string, limit: number) => {
    if (numbersArr.includes(selectedNumber)) {
      // If the number is already selected, remove it from the selection
      numbersArrSetter((prev) => prev.filter((num) => selectedNumber !== num));
    } else if (numbersArr.length < limit) {
      // If the selection limit hasn't been reached, add the number
      numbersArrSetter((prev) => [...prev, selectedNumber]);
    }
  };

  // Generate an array of numbers to render, from 1 to numbersToRender
  for (let n = 1; n <= Number(numbersToRender); n++) {
    arrNums.push(n.toString());
  }

  // Function to return CSS classes for selected and unselected numbers
  const renderClasses = (num: string) => {
    return numbersArr.includes(num) ? styles.numberSelected : "";
  };

  return (
    <>
      {/* Container for number buttons */}
      <div className={styles.container}>
        {arrNums.map((num) => {
          return (
            <button
              type="button"
              key={num}
              className={`${styles.numberContainer} ${renderClasses(num)}`}
              onClick={() => addNumberToSelection(num, selectionLimit)} // Use dynamic selection limit
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Display the selected numbers, sorted */}
      <div className={styles.selectedNumbers}>
        {numbersArr
          .sort((a, b) => Number(a) - Number(b))
          .map((num) => (
            <span className={styles.selectedNumber} key={num}>
              {num}
            </span>
          ))}
      </div>
    </>
  );
};

export default ChooseNumbersComp;
