import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";

import Error from "./Error";
import useMoneda from "../hooks/useMoneda";
import useCriptomoneda from "../hooks/useCriptomoneda";

import PropTypes from "prop-types";

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: white;
  transform: background-color 0.3s ease;

  &:hover {
    background-color: #326ac0;
    cursor: pointer;
  }
`;

const Formulario = ({ guardarMoneda, guardarCriptoMoneda }) => {
  const [listaCripto, guardarCriptomonedas] = useState([]);
  const [error, guardarError] = useState(false);

  const MODENAS = [
    { codigo: "USD", nombre: "Dolar de Estados Unidos" },
    { codigo: "COP", nombre: "Peso Colombiano" },
    { codigo: "EUR", nombre: "Euro" },
    { codigo: "MXN", nombre: "Peso Mexicano" },
  ];

  const [moneda, SelectMonedas] = useMoneda("Elige tu Moneda", "", MODENAS);

  const [criptomoneda, SelectCripto] = useCriptomoneda(
    "Elige tu Criptomoneda",
    "",
    listaCripto
  );

  useEffect(() => {
    const consultarAPI = async () => {
      const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

      const resultado = await axios.get(url);

      guardarCriptomonedas(resultado.data.Data);
    };
    consultarAPI();
  }, []);

  const cotizarMoneda = (e) => {
    e.preventDefault();

    if (moneda === "" || criptomoneda === "") {
      guardarError(true);
      return;
    }

    guardarError(false);
    guardarMoneda(moneda);
    guardarCriptoMoneda(criptomoneda);
  };

  return (
    <form onSubmit={cotizarMoneda}>
      {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}
      <SelectMonedas />
      <SelectCripto />
      <Boton type="submit" value="Calcular" />
    </form>
  );
};

Formulario.propTypes = {
  guardarMoneda: PropTypes.func.isRequired, 
  guardarCriptoMoneda: PropTypes.func.isRequired,
};

export default Formulario;
