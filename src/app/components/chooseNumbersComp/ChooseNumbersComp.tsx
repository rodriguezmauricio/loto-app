"use client";

import { useState } from "react";
import NumbersSorteio from "../numbersSorteio/NumbersSorteio";
import styles from "./chooseNumbersComp.module.css";

interface IChooseNumbersComp {
  numbersToRender: number;
  selectionLimit: number;
}

const ChooseNumbersComp = ({ numbersToRender, selectionLimit }: IChooseNumbersComp) => {
  let arrNums: string[] = [];

  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);

  const addNumberToSelection = (selectedNumber: string, limit: number) => {
    if (selectedNumbers.length < limit) {
      selectedNumbers.includes(selectedNumber)
        ? setSelectedNumbers((prev) => prev.filter((num) => selectedNumber !== num))
        : setSelectedNumbers((prev) => [...prev, selectedNumber]);
    } else {
      setSelectedNumbers((prev) => prev.filter((num) => selectedNumber !== num));
    }
  };

  for (let n = 1; n <= Number(numbersToRender); n++) {
    arrNums.push(n.toString());
  }

  const renderClasses = (num: string) => {
    return selectedNumbers.includes(num) ? styles.numberSelected : "";
  };

  return (
    <>
      <div className={styles.container}>
        {arrNums.map((num) => {
          return (
            <button
              type="button"
              key={num}
              className={`${styles.numberContainer} ${renderClasses(num)}`}
              onClick={() => addNumberToSelection(num, 10)}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* HEADER: CODE TO SORT THE SELECTED NUMBERS */}
      {selectedNumbers
        .sort((a, b) => {
          return Number(a) - Number(b);
        })
        .map((num) => (
          <span style={{ padding: "10px" }} key={num}>
            {num}
          </span>
        ))}
    </>
  );
};

export default ChooseNumbersComp;
