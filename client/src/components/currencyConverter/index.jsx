import React, { useCallback } from "react";
import { useSelector } from "react-redux";

const CurrencyConverter = ({ amount, exchangeRates }) => {
  const state = useSelector((s) => s.curr);

  const convertCurrency = useCallback(() => {
    if (state.course === "usd") return amount;
    return amount * exchangeRates[state.course];
  }, [state]);

  return (
    <span>
      {convertCurrency(amount, currency).toFixed(2)} {currency}
    </span>
  );
};

export default CurrencyConverter;
