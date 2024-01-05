import React, { createContext, useContext, useEffect, useState } from "react";
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

// Create a new context for passing the currency used to all components
const CurrencyContext = createContext()

export function useCurrencyContext() {
  return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }) {

  const currency = "$"

  return (
    <CurrencyContext.Provider value={currency}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Create a new context for passing updated categories list to all components
const CategoriesContext = createContext();

export function useCategoriesContext() {
  return useContext(CategoriesContext);
}

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCategories = await getCategory();
      setCategories(fetchedCategories);
    };
    fetchData();
  }, []);

  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  );
}
