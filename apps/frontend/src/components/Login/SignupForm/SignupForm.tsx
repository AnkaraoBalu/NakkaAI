import { useState } from "react";
import type { SignupDetails } from "@nakka/types/users";
import { authApi } from "../../../api/auth";
import { useAuth } from "../../../api-hooks/auth";
import StepIndicator from "./StepIndicator";
import DetailsStep from "./DetailsStep";
import VerifyStep from "./VerifyStep";
import PasswordStep from "./PasswordStep";
import { trimDetails } from "./validation";
import { styles } from "./SignupForm.style";

const STEPS = ["details", "verify", "password"] as const;
type Step = (typeof STEPS)[number];

// The code that was emailed, and for which email and username.
interface SentCode {
  email: string;
  username: string;
  expiresAt: number;
  resendAvailableAt: number;
}

interface SignupFormProps {
  onSwitch: () => void;
  onDone: () => void;
}

// Sign-up in three steps: personal details, email code, password.
export default function SignupForm({ onSwitch, onDone }: SignupFormProps) {
  const { signup } = useAuth();
  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<SignupDetails>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });
  const [sentCode, setSentCode] = useState<SentCode | null>(null);
  const [verificationToken, setVerificationToken] = useState("");

  async function sendCode() {
    const clean = trimDetails(details);
    const response = await authApi.sendSignupOtp(clean);
    setSentCode({
      email: response.email,
      username: clean.username.toLowerCase(),
      expiresAt: Date.parse(response.expiresAt),
      resendAvailableAt: Date.parse(response.resendAvailableAt),
    });
    setStep("verify");
  }

  async function continueFromDetails() {
    const clean = trimDetails(details);
    // Came back without changing email or username, and the code still works: reuse it.
    const reusable =
      sentCode &&
      sentCode.email === clean.email.toLowerCase() &&
      sentCode.username === clean.username.toLowerCase() &&
      sentCode.expiresAt > Date.now();
    if (reusable) setStep("verify");
    else await sendCode();
  }

  async function verifyCode(code: string) {
    if (!sentCode) return;
    const response = await authApi.verifySignupOtp({
      email: sentCode.email,
      code,
    });
    setVerificationToken(response.verificationToken);
    setStep("password");
  }

  async function createAccount(password: string) {
    await signup({ ...trimDetails(details), password, verificationToken });
    onDone();
  }

  function startOver() {
    setSentCode(null);
    setVerificationToken("");
    setStep("details");
  }

  return (
    <div>
      <StepIndicator current={STEPS.indexOf(step)} />
      <div key={step} className={styles.step}>
        {step === "details" && (
          <DetailsStep
            values={details}
            onChange={setDetails}
            onContinue={continueFromDetails}
            onSwitch={onSwitch}
          />
        )}
        {step === "verify" && sentCode && (
          <VerifyStep
            email={sentCode.email}
            resendAvailableAt={sentCode.resendAvailableAt}
            onVerify={verifyCode}
            onResend={sendCode}
            onChangeEmail={() => setStep("details")}
          />
        )}
        {step === "password" && sentCode && (
          <PasswordStep
            email={sentCode.email}
            onCreate={createAccount}
            onStartOver={startOver}
          />
        )}
      </div>
    </div>
  );
}
