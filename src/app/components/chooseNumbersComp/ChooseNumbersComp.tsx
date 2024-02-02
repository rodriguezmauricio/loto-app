"use client";

import { Dispatch, SetStateAction, useState } from "react";
import NumbersSorteio from "../numbersSorteio/NumbersSorteio";
import styles from "./chooseNumbersComp.module.css";

interface IChooseNumbersComp {
  numbersToRender: number;
  selectionLimit: number;
  numbersArr: string[];
  numbersArrSetter: React.Dispatch<React.SetStateAction<string[]>>;
}

const ChooseNumbersComp = ({
  numbersToRender,
  selectionLimit,
  numbersArr,
  numbersArrSetter,
}: IChooseNumbersComp) => {
  let arrNums: string[] = [];

  const addNumberToSelection = (selectedNumber: string, limit: number) => {
    if (numbersArr.length < limit) {
      numbersArr.includes(selectedNumber)
        ? numbersArrSetter((prev) => prev.filter((num) => selectedNumber !== num))
        : numbersArrSetter((prev) => [...prev, selectedNumber]);
    } else {
      numbersArrSetter((prev) => prev.filter((num) => selectedNumber !== num));
    }
  };

  for (let n = 1; n <= Number(numbersToRender); n++) {
    arrNums.push(n.toString());
  }

  const renderClasses = (num: string) => {
    return numbersArr.includes(num) ? styles.numberSelected : "";
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
      {/* {numbersArr
        .sort((a, b) => {
          return Number(a) - Number(b);
        })
        .map((num) => (
          <span style={{ padding: "10px" }} key={num}>
            {num}
          </span>
        ))} */}
    </>
  );
};

export default ChooseNumbersComp;
