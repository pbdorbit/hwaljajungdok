import { useCallback, useState } from "react";

const DEFAULT = "저장한 문장으로 타자 연습을 시작해보세요";

const useWords = (sentence: string = DEFAULT) => {
  const [words, setWords] = useState<string>(sentence);

  const updateWords = useCallback((newSentence: string = DEFAULT) => {
    setWords(newSentence);
  }, []);

  return { words, updateWords };
};

export default useWords;
