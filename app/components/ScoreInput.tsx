import { Button, Input, message } from "antd";
import React, { FC, useState } from "react";
import useMatch from "../hooks/MatchProvider";

const ScoreInput = () => {
  const { match, NextRound, GetRemainingScore } = useMatch();
  const [inputValue, setInputValue] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const info = (message: string) => {
    messageApi.open({
      type: "warning",
      content: message,
      className: "text-black",
    });
  };

  const handleSubmit = async () => {
    try {
      setDisabled(true);
      await NextRound(inputValue);
      setInputValue("");
    } catch (error) {
      if (error instanceof Error) {
        info(error.message);
      }
    } finally {
      setDisabled(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 flex items-center gap-4 w-full max-w-md">
      <div className="flex-1 relative">
        {contextHolder}

        <Input
          value={inputValue}
          onInput={(e: React.FormEvent<HTMLInputElement>) =>
            handleInputChange(e.currentTarget.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Score"
          size="large"
          disabled={match?.isOver || disabled}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-lg font-medium placeholder-white/50 focus:border-emerald-400 focus:bg-white/10 focus:outline-none transition-all backdrop-blur-sm"
        />
      </div>
      <Button
        type="primary"
        className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 shadow-lg"
        onClick={handleSubmit}
        disabled={match?.isOver || disabled}
        loading={disabled}
      >
        Next
      </Button>
    </div>
  );
};

export default ScoreInput;