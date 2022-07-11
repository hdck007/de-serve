import { Button, Card } from "antd";
import { useContractLoader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const someArray = new Array(20).fill(0);

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ customContract, provider, chainId, contractConfig, name }) {
  const [surveys, setSurveys] = useState([]);

  const contracts = useContractLoader(provider, contractConfig, chainId);
  let contract;
  if (!customContract) {
    contract = contracts ? contracts[name] : "";
  } else {
    contract = customContract;
  }

  useEffect(() => {
    if (!contract) return;
    contract.getAllSurveys().then(data => setSurveys(data));
  }, [contracts]);

  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        rowGap: "1rem",
      }}
    >
      {surveys.map((item, index) => (
        <div
          style={{
            padding: "10px",
            width: "200px",
            height: "200px",
            borderRadius: "10px",
            boxShadow: "1px 2px 3px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              width: "100%",
            }}
          >
            {item.title}
          </h3>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Button>{Number(item.participants._hex)}</Button>
            <Button>
              <Link to={`survey/${index}`}>Check</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
