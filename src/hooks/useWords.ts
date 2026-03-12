import { useCallback, useState } from "react";
import { getRandomSentence } from "../data/Dummysentences";

const useWords = () => {
  const [words, setWords] = useState<string>(
    () => getRandomSentence().text, // 초기값도 랜덤 문장
  );

  const updateWords = useCallback(() => {
    setWords(getRandomSentence().text); // 재시작 시 새 랜덤 문장
  }, []);

  return { words, updateWords };
};

export default useWords;
