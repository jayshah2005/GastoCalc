import { createContext, useContext, useEffect } from "react";
import { getCategory } from "../function/categoriesFetcher";

const month = createContext([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);

  let categories = createContext(await getCategory());


  export { month }