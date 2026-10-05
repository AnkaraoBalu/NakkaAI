import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/react";
import type { SignupDetails } from "@nakka/types/users";
import { CLERK_PUBLISHABLE_KEY } from "../../../context/ClerkSetup";
import { authApi } from "../../../api/auth";
import { rememberReturn } from "../../../api-hooks/auth/useOAuth";
import StepIndicator from "./StepIndicator";
import DetailsStep from "./DetailsStep";
import VerifyStep from "./VerifyStep";
import PasswordStep from "./PasswordStep";
import { trimDetails } from "./validation";
import { styles } from "./SignupForm.style";

interface SignupFormProps { onSwitch: () => void; onDone: () => void; }
const STEPS = ["details", "password", "verify"] as const;
type Step = (typeof STEPS)[number];
function check(result: { error: { message: string; longMessage?: string } | null }) {
  if (result.error) throw new Error(result.error.longMessage ?? result.error.message);
}

export default function SignupForm(props: SignupFormProps) {
  if (!CLERK_PUBLISHABLE_KEY) return <p role="alert">Registration is unavailable. Please try again later.</p>;
  return <ClerkSignupForm {...props} />;
}

function ClerkSignupForm({ onSwitch }: SignupFormProps) {
  const { signUp } = useSignUp();
  useEffect(() => { rememberReturn(); }, []);
  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<SignupDetails>({ firstName: "", lastName: "", email: "", username: "" });
  const [resendAvailableAt, setResendAvailableAt] = useState(0);

  async function continueFromDetails() {
    await authApi.checkSignupDetails(trimDetails(details));
    setStep("password");
  }
  async function sendCode() {
    check(await signUp.verifications.sendEmailCode());
    setResendAvailableAt(Date.now() + 30_000);
    setStep("verify");
  }
  async function choosePassword(password: string) {
    const clean = trimDetails(details);
    check(await signUp.password({ emailAddress: clean.email.toLowerCase(), password,
      firstName: clean.firstName, lastName: clean.lastName,
      unsafeMetadata: { nakkaUsername: clean.username.toLowerCase() } }));
    await sendCode();
  }
  async function verifyCode(code: string) {
    // A completed Clerk account can retry the handoff without verifying twice.
    if (signUp.status !== "complete") check(await signUp.verifications.verifyEmailCode({ code }));
    if (signUp.status !== "complete") throw new Error("Your account needs additional verification. Please use the sign-in form to continue.");
    check(await signUp.finalize({ navigate: ({ decorateUrl }) => {
      window.location.assign(decorateUrl("/sso-callback/complete"));
    } }));
  }
  function startOver() {
    signUp.reset();
    setStep("details");
  }
  return (
    <div>
      <StepIndicator current={STEPS.indexOf(step)} />
      <div id="clerk-captcha" />
      <div key={step} className={styles.step}>
        {step === "details" && <DetailsStep values={details} onChange={setDetails} onContinue={continueFromDetails} onSwitch={onSwitch} />}
        {step === "password" && <PasswordStep email={trimDetails(details).email} onCreate={choosePassword} onStartOver={startOver} />}
        {step === "verify" && <VerifyStep email={trimDetails(details).email} resendAvailableAt={resendAvailableAt} onVerify={verifyCode} onResend={sendCode} onChangeEmail={startOver} />}
      </div>
    </div>
  );
}
