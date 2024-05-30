import getSymbolFromCurrency from "currency-symbol-map";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const CurrencyConverter = ({ amount, exchangeRates, ...props }) => {
  const state = useSelector((s) => s.curr);

  const convertCurrency = useMemo(() => {
    if (!amount) return 0;
    if (state.course === "usd") return amount;
    return (
      amount * exchangeRates?.find((item) => item.key === state.key)?.course
    );
  }, [state, amount, exchangeRates]);

  return (
    <div {...props}>
      {convertCurrency.toFixed(2)} {getSymbolFromCurrency(state.key)}
    </div>
  );
};

export default CurrencyConverter;
