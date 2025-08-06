import { Button, message } from "antd";
import React, { useRef, useState } from "react";
import useMatch from "../hooks/MatchProvider";

const ScoreInput = () => {
  const { match, NextRound, GetRemainingScore } = useMatch();
  const [inputValue, setInputValue] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // Native HTML input ref
  const inputRef = useRef<HTMLInputElement>(null);

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
      // Fókusz visszaállítása a submit után
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
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
    <div className="w-full flex items-center px-20 py-5">
      {contextHolder}
      
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Score"
        disabled={match?.isOver || disabled}
        className="w-full text-center font-bold flex-1 bg-transparent border-b-2 border-0 outline-none text-lg placeholder-gray-400 focus:border-b-2 focus:placeholder-gray-300 disabled:opacity-50 animate-pulse"
      />
    </div>
  );
};

export default ScoreInput;