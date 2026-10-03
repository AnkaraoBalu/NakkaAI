import { Link } from "react-router-dom";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_ENTITY,
  SITE_URL,
} from "../../../constants/legal";
import LegalPage, { Section, legalStyles as s } from "../LegalPage";

export default function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms are an agreement between you and {LEGAL_ENTITY} ("Nakka",
        "we", "us") for your use of the website at {SITE_URL} and the Nakka
        extension for VS Code (together, the "Service"). By creating an account
        or using the Service, you agree to these terms and to our{" "}
        <Link className={s.link} to="/privacy">
          Privacy Policy
        </Link>
        .
      </p>

      <Section title="Your account">
        <ul className={s.list}>
          <li>You must be at least 13 years old to use the Service.</li>
          <li>Give accurate information and keep it up to date.</li>
          <li>
            Keep your password and sign-in tokens private. You're responsible
            for activity on your account.
          </li>
          <li>
            Tell us right away at{" "}
            <a className={s.link} href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
              {LEGAL_CONTACT_EMAIL}
            </a>{" "}
            if you think someone else has used your account.
          </li>
        </ul>
      </Section>

      <Section title="Using the Service">
        <p>You agree not to:</p>
        <ul className={s.list}>
          <li>Break the law or infringe anyone's rights.</li>
          <li>
            Share your account, resell access, or try to get around usage
            limits.
          </li>
          <li>
            Attack, overload, scrape or reverse engineer the Service, or access
            it in ways we don't offer.
          </li>
          <li>
            Use the Service in ways that break the usage policies of the AI
            providers behind it (Anthropic, OpenAI, Google and xAI).
          </li>
        </ul>
      </Section>

      <Section title="Your content and AI output">
        <p>
          You keep ownership of the prompts and code you send ("Input"). You're
          responsible for having the right to send it. As between you and us,
          you own the replies you receive ("Output"), to the extent the law
          allows.
        </p>
        <p>
          AI output can be wrong, insecure or similar to output given to others.
          Review and test it before you rely on it. You're responsible for how
          you use it.
        </p>
      </Section>

      <Section title="Plans, limits and payment">
        <p>
          Each plan includes usage allowances that reset over time. When an
          allowance runs out, requests are paused until it resets or you
          upgrade. We may change plans, allowances and available models. If you
          buy a paid plan, the price and billing terms are shown when you buy,
          and we'll tell you before changing them.
        </p>
      </Section>

      <Section title="Our rights">
        <p>
          Nakka, its name, logo, website and software belong to us and our
          licensors. We give you a personal, non-transferable right to use the
          Service under these terms. We may change or stop parts of the Service
          at any time.
        </p>
      </Section>

      <Section title="Suspension and ending your account">
        <p>
          You can stop using the Service at any time and ask us to delete your
          account. We may suspend or close accounts that break these terms or
          put the Service or other users at risk.
        </p>
      </Section>

      <Section title="Disclaimers">
        <p>
          The Service is provided "as is" and "as available", without
          warranties of any kind, to the extent the law allows. We don't promise
          that it will be uninterrupted, error-free or that AI output will be
          accurate.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the extent the law allows, Nakka isn't liable for indirect,
          incidental, special or consequential damages, or for lost profits,
          data or goodwill. Our total liability for any claim about the Service
          is limited to the amount you paid us in the 12 months before the
          claim, or US$50 if that's more.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          If we change these terms, we'll update the date at the top. For
          important changes we'll also tell you by email or on the website.
          Continuing to use the Service after a change means you accept it.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a className={s.link} href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
