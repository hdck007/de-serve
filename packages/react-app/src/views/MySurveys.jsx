import { Button } from "antd";
import React from "react";
import { useContractLoader } from "eth-hooks";
import { Transactor } from "../helpers";

export default function RespondPage({ signer, name, provider, contractConfig, chainId, gasPrice, contractFunction }) {
  const [surveys, setSurveys] = React.useState([]);

  const tx = Transactor(provider, gasPrice);

  const contracts = useContractLoader(provider, contractConfig, chainId);
  const contract = contracts ? contracts[name] : "";

  const result =
    contract && contract
      ? Object.entries(contract.interface.functions).filter(fn => {
          return fn[1]["type"] === "function" && fn[1]["name"] === "getAllSurveysByOrg";
        })[0]
      : [];

  const result2 =
    contract && contract
      ? Object.entries(contract.interface.functions).filter(fn => {
          return fn[1]["type"] === "function" && fn[1]["name"] === "getAllResponsesForSurvey";
        })[0]
      : [];

  const getAllSurveysByOrg = contract && contract.connect(signer)[result[0]];
  const getAllResponsesForSurvey = contract && contract.connect(signer)[result2[0]];

  React.useEffect(() => {
    if (!getAllSurveysByOrg) return;
    getAllSurveysByOrg().then(data => setSurveys(data));
  }, [getAllSurveysByOrg]);

  return (
    <div
      style={{
        width: "80%",
        paddingTop: "2rem",
        margin: "auto",
      }}
    >
      {surveys.map(item => (
        <div
          style={{
            padding: "10px",
            width: "200px",
            height: "150px",
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
          <Button
            type="primary"
            onClick={async () => {
              const answer = await getAllResponsesForSurvey(Number(item.id));
              const text = JSON.stringify(answer);
              const blob = new Blob([text], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "answer.json";
              link.click();
            }}
          >
            download responses
          </Button>
        </div>
      ))}
    </div>
  );
}
