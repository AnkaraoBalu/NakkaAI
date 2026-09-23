import { useEffect, useState } from "react";

export const command = 'nakka run "Fix the failing user authentication tests"';
const stepDelays = [400, 1100, 2000, 2800, 3500, 4300];

export function useTerminalDemo() {
  const [run, setRun] = useState(0);
  const [typed, setTyped] = useState(0);
  const [step, setStep] = useState(0);
  const [testCount, setTestCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(command.length);
      setStep(6);
      setTestCount(18);
      return;
    }
    setTyped(0);
    setStep(0);
    setTestCount(0);
    const start = performance.now();
    const typingDuration = command.length * 40;
    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      setTyped(Math.min(command.length, Math.floor(elapsed / 40)));
      setStep(
        stepDelays.filter((delay) => elapsed >= typingDuration + delay).length,
      );
      const count = Math.min(
        18,
        Math.max(0, Math.floor((elapsed - typingDuration - 4300) / 40) * 2),
      );
      setTestCount(count);
      if (count === 18) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [run]);

  return { typed, step, testCount, setRun };
}
