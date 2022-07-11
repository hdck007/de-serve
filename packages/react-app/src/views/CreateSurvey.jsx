import { Button, Input } from "antd";
import React from "react";
import { Dropdown, Menu, Space } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import { useContractLoader } from "eth-hooks";
import { Transactor } from "../helpers";
import { useHistory } from "react-router-dom";

export default function CreateSurvey({ signer, name, provider, contractConfig, chainId, gasPrice, contractFunction }) {
  const [formState, setFormState] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [txValue, setTxValue] = React.useState();
  const history = useHistory();
  const tx = Transactor(provider, gasPrice);

  const contracts = useContractLoader(provider, contractConfig, chainId);
  const contract = contracts ? contracts[name] : "";

  const result =
    contract && contract
      ? Object.entries(contract.interface.functions).filter(fn => {
          return fn[1]["type"] === "function" && fn[1]["name"] === "addSurvey";
        })[0]
      : [];

  console.debug({ result });

  const addSurvey = contract && contract.connect(signer)[result[0]];

  const handleRemoveOption = (index, optionIndex) => {
    const newFormState = [...formState];
    newFormState[index].options.splice(optionIndex, 1);
    setFormState(newFormState);
  };

  const handleOptionChange = (index, optionsIndex, value) => {
    const newFormState = [...formState];
    newFormState[index].options[optionsIndex] = value;
    setFormState(newFormState);
  };

  const handleAddOption = index => {
    const newFormState = [...formState];
    newFormState[index].options.push("");
    console.debug(newFormState);
    setFormState(newFormState);
  };

  const handleAddOptionsInput = () => {
    setFormState([
      ...formState,
      {
        question: "",
        type: "options",
        options: [],
      },
    ]);
  };

  const hanndleRemoveQuestion = index => {
    const newFormState = [...formState];
    newFormState.splice(index, 1);
    setFormState(newFormState);
  };

  const handleQuestionChange = (index, value) => {
    const newFormState = [...formState];
    newFormState[index].question = value;
    setFormState(newFormState);
  };

  const handleSubmit = async () => {
    const overrides = {};
    if (txValue) {
      overrides.value = txValue; // ethers.utils.parseEther()
    }
    if (gasPrice) {
      overrides.gasPrice = gasPrice;
    }

    const returned = await tx(addSurvey(title, JSON.stringify(formState), overrides));
    if (returned) {
      history.push("/", { replace: true });
    }
  };

  const handleAddTextInput = () => {
    setFormState([
      ...formState,
      {
        question: "",
        type: "text",
      },
    ]);
  };

  const menu = (
    <Menu>
      <MenuItem key={"text-input"} onClick={handleAddTextInput}>
        text input
      </MenuItem>
      <MenuItem key={"options-input"} onClick={handleAddOptionsInput}>
        options input
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      <Input
        rows={3}
        placeholder="enter the survey title"
        style={{
          fontSize: "2rem",
          width: "80%",
          marginTop: "2rem",
        }}
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
      <div
        style={{
          width: "80%",
          margin: "auto",
        }}
      >
        {formState.map((item, index) => (
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
              <Input
                onBlur={e => handleQuestionChange(index, e.target.value)}
                placeholder="Enter the question"
                defaultValue={item.question}
              />
              &nbsp;&nbsp;
              <Button onClick={() => hanndleRemoveQuestion(index)}>remove question</Button>
            </div>
            {item.type === "options" ? (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "50px",
                }}
              >
                {item.options.map((option, optionIndex) => (
                  <p
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                    }}
                    key={optionIndex + "option"}
                  >
                    <Input
                      style={{
                        width: "200px",
                      }}
                      defaultValue={option}
                      onBlur={e => handleOptionChange(index, optionIndex, e.target.value)}
                    />
                    &nbsp;&nbsp;
                    <Button onClick={() => handleRemoveOption(index, optionIndex)}>remove</Button>
                  </p>
                ))}
                <Button
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                  }}
                  onClick={() => handleAddOption(index)}
                >
                  add option
                </Button>
              </div>
            ) : (
              <Input
                style={{
                  width: "200px",
                  marginTop: "0.5rem",
                }}
                value="text input"
              />
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "90%",
        }}
      >
        <Dropdown overlay={menu} trigger={["click"]}>
          <Space
            style={{
              cursor: "pointer",
              padding: "0.1rem 2rem",
              marginTop: "2.5rem",
              borderRadius: "120px",
              border: "1px solid rgba(0,0,0,0.5)",
            }}
          >
            add question
          </Space>
        </Dropdown>
      </div>
      <Button
        style={{
          width: "200px",
          borderRadius: "200px",
          marginTop: "1rem",
        }}
        onClick={handleSubmit}
      >
        create survey
      </Button>
    </div>
  );
}
