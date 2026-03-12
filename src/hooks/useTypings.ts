import { useCallback, useEffect, useRef, useState } from "react";

const useTypings = (enabled: boolean) => {
  const [typed, setTyped] = useState<string>("");
  const totalTyped = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 화면 클릭하면 input에 포커스
  useEffect(() => {
    if (enabled) {
      inputRef.current?.focus();
    }
  }, [enabled]);

  const handleInput = useCallback(
    (e: Event) => {
      if (!enabled) return;
      const value = (e.target as HTMLInputElement).value;
      totalTyped.current = value.length;
      setTyped(value);
    },
    [enabled],
  );

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.addEventListener("input", handleInput);
    return () => input.removeEventListener("input", handleInput);
  }, [handleInput]);

  const clearTyped = useCallback(() => {
    setTyped("");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
  }, []);

  return {
    typed,
    cursor: typed.length,
    clearTyped,
    resetTotalTyped,
    totalTyped: totalTyped.current,
    inputRef, // 👈 추가
  };
};

export default useTypings;
