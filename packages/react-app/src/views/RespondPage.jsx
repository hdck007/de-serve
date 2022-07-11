import { Button, Input, Select } from "antd";
import React from "react";
import { Dropdown, Menu, Space } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import { useContractLoader } from "eth-hooks";
import { Transactor } from "../helpers";
import { useHistory, useParams } from "react-router-dom";

const { Option } = Select;

export default function RespondPage({ signer, name, provider, contractConfig, chainId, gasPrice, contractFunction }) {
  const [txValue, setTxValue] = React.useState();
  const [survey, setSurvey] = React.useState([]);
  const [answer, setAnswer] = React.useState([]);
  const [surveyTitle, setSurveyTitle] = React.useState("");
  const { id } = useParams();
  const history = useHistory();

  const tx = Transactor(provider, gasPrice);

  const contracts = useContractLoader(provider, contractConfig, chainId);
  const contract = contracts ? contracts[name] : "";

  React.useEffect(() => {
    if (!contract) return;
    contract.getSurvey(Number(id)).then(data => {
      setSurvey(JSON.parse(data[1]));
      setAnswer(survey.map(item => ""));
      setSurveyTitle(data[0]);
    });
  }, [contracts]);

  const result =
    contract && contract
      ? Object.entries(contract.interface.functions).filter(fn => {
          return fn[1]["type"] === "function" && fn[1]["name"] === "addResponse";
        })[0]
      : [];

  const addResponse = contract && contract.connect(signer)[result[0]];

  const handleSubmit = async () => {
    const overrides = {};
    if (txValue) {
      overrides.value = txValue; // ethers.utils.parseEther()
    }
    if (gasPrice) {
      overrides.gasPrice = gasPrice;
    }
    console.debug(answer);

    const returned = await tx(addResponse(Number(id), JSON.stringify(answer), overrides));
    if (returned) {
      history.push("/", { replace: true });
    }
  };

  const handleInputChange = (index, value) => {
    const newAnswerState = [...answer];
    newAnswerState[index] = value;
    setAnswer(newAnswerState);
  };

  return (
    <div>
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
                  display: "flex",
                }}
              >
                <Select
                  style={{
                    width: "400px",
                  }}
                  onChange={value => handleInputChange(index, value)}
                >
                  {item.options.map(option => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </div>
            ) : (
              <Input
                style={{
                  marginTop: "0.5rem",
                }}
                onChange={e => handleInputChange(index, e.target.value)}
                placeholder="Enter your answer here"
              />
            )}
          </div>
        ))}
      </div>
      <Button
        style={{
          width: "200px",
          borderRadius: "200px",
          marginTop: "1rem",
        }}
        onClick={handleSubmit}
      >
        submit response
      </Button>
    </div>
  );
}
