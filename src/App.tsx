import React from "react";
import { faker } from "@faker-js/faker";
import RestartButton from "./components/RestartButton";
import Results from "./components/Results";
import UserTypings from "./components/UserTypings";
import useEngine from "./hooks/useEngine";
import { calculateAccuracyPercentage } from "./utils/helpers";
const PRACTICE_SENTENCE =
  "우리는 언젠가 모두 떠나지만, 남긴 말들은 오래 머문다.";

const words = faker.random.words(10);

function App() {
  const {
    state,
    words,
    timeLeft,
    typed,
    errors,
    restart,
    totalTyped,
    inputRef,
  } = useEngine(PRACTICE_SENTENCE);

  return (
    <>
      {/* 한글 입력을 위한 숨겨진 input */}
      <input
        ref={inputRef}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />
      <CountdownTimer timeLeft={timeLeft} />
      <div onClick={() => inputRef.current?.focus()} style={{ cursor: "text" }}>
        <WordsContainer>
          <GenerateWords words={words} />
          <UserTypings
            className="absolute inset-0"
            words={words}
            userInput={typed}
          />
        </WordsContainer>
      </div>
      <RestartButton
        className="m-auto mt-10 text-slate-500"
        onRestart={restart}
      />
      <Results
        state={state}
        className="mt-10"
        errors={errors}
        accuracyPercentage={calculateAccuracyPercentage(errors, totalTyped)}
        total={totalTyped}
      />
    </>
  );
}

const WordsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mt-3 text-3xl leading-relaxed break-all">
      {children}
    </div>
  );
};

const GenerateWords = ({ words }: { words: string }) => {
  return <div className="text-slate-500">{words}</div>;
};

const CountdownTimer = ({ timeLeft }: { timeLeft: number }) => {
  return <h2 className="font-medium text-primary-400">Time: {timeLeft}</h2>;
};

export default App;
