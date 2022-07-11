import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useContractLoader } from "eth-hooks";
import { Button } from "antd";
import { Transactor } from "../helpers";

export default function Survey({ provider, contractConfig, chainId, gasPrice,  name, signer }) {
  const { id } = useParams();
  const [survey, setSurvey] = React.useState([]);
  const [surveyTitle, setSurveyTitle] = React.useState("");
  const contracts = useContractLoader(provider, contractConfig, chainId);
  const contract = contracts ? contracts[name] : "";
  const tx = Transactor(provider, gasPrice);
  const history = useHistory();

  React.useEffect(() => {
    if (!contract) return;
    contract.getSurvey(Number(id)).then(data => {
      console.log(data);
      setSurvey(JSON.parse(data[4]));
      setSurveyTitle(data[3]);
    });
  }, [contracts]);

  const result =
    contract && contract
      ? Object.entries(contract.interface.functions).filter(fn => {
          return fn[1]["type"] === "function" && fn[1]["name"] === "buySurvey";
        })[0]
      : [];

  const buySurvey = contract && contract.connect(signer)[result[0]];

  const handleBuy = async () => {
    const overrides = {};

    const returned = await tx(buySurvey(Number(id), overrides));
    if (returned) {
      history.push("/my-surveys", { replace: true });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <br />
      <br />
      <h1
        style={{
          fontSize: "2rem",
          width: "80%",
          margin: "auto",
          marginTop: "2rem",
          textAlign: "left",
          fontWeight: "bold",
        }}
      >
        Title: {surveyTitle}
      </h1>
      <div
        style={{
          width: "80%",
          margin: "auto",
        }}
      >
        {survey.map((item, index) => (
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "1px 2px 3px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
              }}
            >
              <h2
                style={{
                  fontWeight: "bold",
                }}
              >
                {item.question}
              </h2>
            </div>
            {item.type === "options" ? (
              <div
                style={{
                  position: "relative",
                }}
              >
                {item.options.map((option, optionIndex) => (
                  <p
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.2rem 3rem",
                        boxShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        borderRadius: "100px",
                      }}
                    >
                      {option}
                    </span>
                    &nbsp;&nbsp;
                  </p>
                ))}
              </div>
            ) : (
              <h4
                style={{
                  textAlign: "left",
                }}
              >
                This is a text based question
              </h4>
            )}
          </div>
        ))}
        <br />
        <br />
        <Button
          style={{
            width: "200px",
            borderRadius: "100px",
          }}
        >
          <Link to={`../respond/${id}`}>take survey</Link>
        </Button>
        &nbsp;&nbsp;
        <Button
          style={{
            width: "200px",
            borderRadius: "100px",
          }}
          onClick={handleBuy}
        >
          buy survey
        </Button>
      </div>
    </div>
  );
}
