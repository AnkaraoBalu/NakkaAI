import { Link } from "react-router-dom";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_ENTITY,
  SITE_URL,
} from "../../../constants/legal";
import LegalPage, { Section, legalStyles as s } from "../LegalPage";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy explains what {LEGAL_ENTITY} ("Nakka", "we", "us") collects
        when you use the website at {SITE_URL} and the Nakka extension for VS
        Code (together, the "Service"), how we use it, and the choices you
        have.
      </p>

      <Section title="What we collect">
        <ul className={s.list}>
          <li>
            <span className={s.strong}>Account details:</span> your first and
            last name, email address and username.
          </li>
          <li>
            <span className={s.strong}>Password:</span> if you set one, we store
            only a salted hash, never the password itself.
          </li>
          <li>
            <span className={s.strong}>Google or GitHub sign-in:</span> if you
            sign in with Google or GitHub, we receive your name, email address
            and account ID from that provider. We don't receive your Google or
            GitHub password.
          </li>
          <li>
            <span className={s.strong}>Usage records:</span> for each AI request
            made through the extension, we record the model, the provider, the
            number of tokens used and the time. We use these to enforce plan
            limits and show your usage.
          </li>
          <li>
            <span className={s.strong}>Sessions:</span> sign-in tokens for the
            website and the extension. We store only a hash of each token.
          </li>
          <li>
            <span className={s.strong}>Email verification:</span> the one-time
            codes we email when you sign up, stored as hashes and deleted or
            expired shortly after.
          </li>
        </ul>
      </Section>

      <Section title="Your prompts and code">
        <p>
          When you use the extension, your prompts and any code or files you
          include are sent through our servers to the AI provider for the model
          you chose (Anthropic, OpenAI, Google or xAI), and the reply is sent
          back to you. We don't store the content of your prompts or the
          replies. Each AI provider handles that content under its own terms
          and privacy policy.
        </p>
      </Section>

      <Section title="How we use your information">
        <ul className={s.list}>
          <li>To create your account, sign you in and keep it secure.</li>
          <li>To send verification codes and important account emails.</li>
          <li>To run the Service and apply your plan's usage limits.</li>
          <li>To fix problems and prevent abuse.</li>
        </ul>
        <p>
          We don't sell your personal information and we don't use it for
          advertising.
        </p>
      </Section>

      <Section title="Service providers">
        <p>We share information only as needed with providers that run the Service for us:</p>
        <ul className={s.list}>
          <li>Clerk, for Google and GitHub sign-in.</li>
          <li>Google and GitHub, when you choose to sign in with them.</li>
          <li>Render, which hosts our servers.</li>
          <li>Neon, which hosts our database.</li>
          <li>Cloudflare, which hosts the website.</li>
          <li>Google (Gmail), which delivers our emails.</li>
          <li>Anthropic, OpenAI, Google and xAI, which answer AI requests.</li>
        </ul>
        <p>
          We may also disclose information if the law requires it, or to
          protect the rights and safety of our users or of Nakka.
        </p>
      </Section>

      <Section title="Cookies and local storage">
        <p>
          The website keeps your sign-in token and a few display preferences in
          your browser's local storage. Clerk sets cookies while a Google or
          GitHub sign-in is in progress. We don't use advertising or tracking
          cookies.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          We keep your account information while your account is open. If you
          ask us to delete your account, we delete your account details,
          sessions and usage records, except where the law requires us to keep
          something longer.
        </p>
      </Section>

      <Section title="Your choices">
        <ul className={s.list}>
          <li>
            Connect or disconnect Google and GitHub, and set or change your
            password, in Settings.
          </li>
          <li>
            Ask for a copy of your information, a correction, or deletion of
            your account by emailing us.
          </li>
        </ul>
      </Section>

      <Section title="Security">
        <p>
          Passwords and tokens are stored as hashes, and data is sent over
          encrypted connections. No system is perfectly secure, so please use a
          strong password and keep your devices safe.
        </p>
      </Section>

      <Section title="Children">
        <p>
          The Service isn't meant for children under 13, and we don't knowingly
          collect information from them.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If we change this policy, we'll update the date at the top. For
          important changes we'll also tell you by email or on the website.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy? Email{" "}
          <a className={s.link} href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>
          . See also our{" "}
          <Link className={s.link} to="/terms">
            Terms of Service
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
