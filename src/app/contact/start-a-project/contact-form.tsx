"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact, type ContactState } from "@/app/contact/start-a-project/actions";
import {
  BUDGETS,
  type ContactErrors,
  type ContactValues,
  FIELDS,
  FILE_ACCEPT,
  FILE_EXTENSIONS,
  MAX_FILE_LABEL,
  NEEDS,
  PROJECT_STATUSES,
  TIMELINES,
  validateContact,
  validateFile,
} from "@/lib/contact-schema";
import { CONTACT_EMAIL } from "@/lib/site-links";
import { cn } from "@/lib/cn";

/*
 * The enquiry, as a short guided conversation.
 *
 * Five steps, one question each, in the order a first conversation needs
 * them: what it is, where it starts, when and how much, the project in your
 * own words, then how to reach you. A counter and a progress line say where
 * you are; Continue checks only the step in hand, so an error is always about
 * what is on screen.
 *
 * Underneath it is still one form. Every step stays mounted — a step that is
 * not in hand is `hidden`, not removed — so the browser posts every field
 * together, and the server action, `validateContact` and the spam checks are
 * unchanged. Without JavaScript the <noscript> rule shows every step at once,
 * so the form still works as a single page.
 *
 * `validateContact` runs as you go and again on the server, where it is the
 * one that counts. If the server refuses a field, the form goes back to the
 * step that holds it and puts focus on it.
 */

type FieldKey = keyof ContactValues | "file";

const STEPS: Array<{ title: string; note?: string; fields: FieldKey[] }> = [
  { title: "What are you building?", fields: ["need"] },
  { title: "Where are you starting from?", fields: ["projectStatus"] },
  { title: "When, and roughly how much?", fields: ["timeline", "budget"] },
  {
    title: "Tell us about it.",
    note: "All optional — but the more you say, the more useful our first reply.",
    fields: ["details", "reference", "file"],
  },
  { title: "How do we reach you?", fields: ["name", "company", "email", "phone"] },
];

const LAST = STEPS.length - 1;

/* Text fields: a hairline to write on, not a box. */
const FIELD =
  "w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-snug tracking-[-0.01em] text-white transition-colors duration-300 placeholder:text-white/85 hover:border-white/40 focus:border-black";

const LABEL = "type-eyebrow block text-white/55";

const EMPTY: ContactValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  need: "",
  projectStatus: "",
  budget: "",
  timeline: "",
  details: "",
  reference: "",
};

const pad = (n: number) => String(n).padStart(2, "0");

export function ContactForm() {
  const [state, action, isPending] = useActionState<ContactState, FormData>(
    submitContact,
    { status: "idle" },
  );
  /** Errors already shown, before any send. */
  const [touched, setTouched] = useState<ContactErrors>({});
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRefs = useRef<Array<HTMLElement | null>>([]);
  /** Set once the visitor has moved between steps, so the first render does not steal focus. */
  const moved = useRef(false);

  /*
   * When this visitor arrived, on their clock rather than the build's.
   *
   * Written to the input imperatively, never as a prop: a hidden input's
   * `value` is its `defaultValue`, so React would write the empty default back
   * over the stamp on every re-render, and the server would refuse a blank
   * stamp. The time itself lives in a ref, so a sender who fixes a field and
   * sends again is not judged to have filled the form in two seconds.
   */
  const arrivedAt = useRef(0);
  const stampRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!arrivedAt.current) arrivedAt.current = Date.now();
    const write = () => {
      if (stampRef.current) stampRef.current.value = String(arrivedAt.current);
    };
    write();
    // Again after the reset that follows a resolved action.
    const frame = requestAnimationFrame(write);
    return () => cancelAnimationFrame(frame);
  }, [state]);

  /*
   * The attachment, held here as well as in the input. A file input has no
   * `defaultValue`, so the reset that follows a rejected send would drop the
   * file silently; putting it back through a `DataTransfer` means a sender
   * who fixes one field does not also have to find the file again.
   */
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const restore = () => {
      const input = fileRef.current;
      if (!input || !file || input.files?.length) return;
      try {
        const carrier = new DataTransfer();
        carrier.items.add(file);
        input.files = carrier.files;
      } catch {
        // No DataTransfer: the field simply comes back empty, as it would have.
      }
    };
    const frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [state, file]);

  const serverErrors = state.status === "invalid" ? state.errors : {};
  const errors: ContactErrors = { ...touched, ...serverErrors };

  /* What the server sent back, and what React resets the fields to. */
  const submitted =
    state.status === "invalid" || state.status === "error"
      ? state.values
      : undefined;

  /*
   * A refused send goes back to the step holding the first problem. Adjusted
   * while rendering, once per response, rather than in an effect, so the
   * right step is on screen in the same commit.
   */
  const firstRefused =
    state.status === "invalid"
      ? [...FIELDS, "file" as const].find((field) => state.errors[field])
      : undefined;
  const [answered, setAnswered] = useState(state);
  if (answered !== state) {
    setAnswered(state);
    const at = firstRefused ? STEPS.findIndex((s) => s.fields.includes(firstRefused)) : -1;
    if (at >= 0) setStep(at);
  }

  // ...and puts focus on the field itself.
  useEffect(() => {
    if (state.status !== "invalid") return;
    const first = [...FIELDS, "file" as const].find((field) => state.errors[field]);
    if (!first) return;
    // After the reset has blurred what it touched.
    const timer = window.setTimeout(() => {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [state]);

  // A new step: its question takes focus, so a screen reader reads it next.
  useEffect(() => {
    if (!moved.current) return;
    const heading = headingRefs.current[step];
    if (!heading) return;
    heading.focus({ preventScroll: true });
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [step]);

  function readForm(): ContactValues {
    const form = formRef.current;
    if (!form) return EMPTY;
    const data = new FormData(form);
    return Object.fromEntries(
      FIELDS.map((field) => [field, String(data.get(field) ?? "")]),
    ) as ContactValues;
  }

  function checkOne(field: keyof ContactValues, value: string) {
    const all = validateContact({ ...EMPTY, ...readForm(), [field]: value });
    setTouched((previous) => ({ ...previous, [field]: all[field] }));
  }

  /** Checks the step in hand only. Returns the first field that fails. */
  function checkStep(at: number): FieldKey | undefined {
    const all: ContactErrors = { ...validateContact(readForm()), file: validateFile(file) };
    const fields = STEPS[at].fields;
    setTouched((previous) => {
      const next = { ...previous };
      for (const field of fields) next[field] = all[field];
      return next;
    });
    return fields.find((field) => all[field]);
  }

  function go(to: number) {
    moved.current = true;
    setStep(Math.max(0, Math.min(LAST, to)));
  }

  function next() {
    const failing = checkStep(step);
    if (failing) {
      formRef.current?.querySelector<HTMLElement>(`[name="${failing}"]`)?.focus();
      return;
    }
    go(step + 1);
  }

  /** The file is checked when it is picked — there is no typing. */
  function pickFile(picked: File | null) {
    setFile(picked);
    setTouched((previous) => ({ ...previous, file: validateFile(picked) }));
  }

  function clearFile() {
    if (fileRef.current) fileRef.current.value = "";
    pickFile(null);
  }

  /*
   * A choice made with the pointer moves on by itself, since there is nothing
   * else on the step to do. One made with the keyboard does not: arrow keys
   * change a radio's value as they move, and would skip the step mid-choice.
   */
  const pointerChoice = useRef(false);
  function chose(field: keyof ContactValues, value: string, advance: boolean) {
    checkOne(field, value);
    if (advance && pointerChoice.current) {
      window.setTimeout(() => go(step + 1), 280);
    }
    pointerChoice.current = false;
  }

  if (state.status === "sent" || state.status === "compose") {
    return <Outcome state={state} />;
  }

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      className="scroll-mt-[calc(var(--global-nav-height)+24px)]"
      onPointerDown={() => {
        pointerChoice.current = true;
      }}
      onKeyDown={(e) => {
        pointerChoice.current = false;
        // Enter in a text field moves on rather than sending half a brief.
        if (
          e.key === "Enter" &&
          step < LAST &&
          e.target instanceof HTMLInputElement &&
          e.target.type !== "file"
        ) {
          e.preventDefault();
          next();
        }
      }}
    >
      <noscript>
        <style>{"[data-step]{display:block!important}[data-step-nav],[data-progress]{display:none!important}"}</style>
      </noscript>

      {/* Honeypot: left empty by everyone who can see the page. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={stampRef} type="hidden" name="startedAt" />

      {/* Where you are. */}
      <div data-progress className="mb-12 bp1020:mb-16">
        <div className="flex items-baseline justify-between">
          <p className="type-eyebrow text-white/55" aria-live="polite">
            <span className="text-white">{pad(step + 1)}</span> / {pad(STEPS.length)}
          </p>
          <ol className="hidden gap-6 bp1020:flex" aria-label="Steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => go(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={cn(
                    "type-eyebrow transition-colors duration-300",
                    i === step ? "text-white" : "text-white/85",
                    i < step && "cursor-pointer hover:text-white",
                  )}
                >
                  {pad(i + 1)}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-4 h-px w-full bg-white/10">
          <div
            className="h-px bg-brand-violet transition-[width] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {STEPS.map((s, i) => (
        <fieldset
          key={s.title}
          data-step
          hidden={i !== step}
          className="m-0 min-w-0 border-0 p-0"
        >
          <legend className="contents">
            <span
              ref={(el) => {
                headingRefs.current[i] = el;
              }}
              tabIndex={-1}
              className="type-subtitle1 block max-w-[18ch] text-balance outline-none"
            >
              {s.title}
            </span>
          </legend>
          {s.note ? (
            <p className="type-body mt-4 max-w-[46ch] text-white/55">{s.note}</p>
          ) : null}

          <div className="mt-10 grid gap-10 bp1020:mt-14">
            {i === 0 ? (
              <Choices
                name="need"
                options={NEEDS}
                defaultValue={submitted?.need}
                error={errors.need}
                onChoose={(v) => chose("need", v, true)}
              />
            ) : null}

            {i === 1 ? (
              <Choices
                name="projectStatus"
                options={PROJECT_STATUSES}
                defaultValue={submitted?.projectStatus}
                error={errors.projectStatus}
                onChoose={(v) => chose("projectStatus", v, true)}
              />
            ) : null}

            {i === 2 ? (
              <>
                <Choices
                  name="timeline"
                  label="Timeline"
                  options={TIMELINES}
                  defaultValue={submitted?.timeline}
                  error={errors.timeline}
                  onChoose={(v) => chose("timeline", v, false)}
                />
                <Choices
                  name="budget"
                  label="Budget range"
                  options={BUDGETS}
                  defaultValue={submitted?.budget}
                  error={errors.budget}
                  onChoose={(v) => chose("budget", v, false)}
                />
              </>
            ) : null}

            {i === 3 ? (
              <>
                <Field
                  name="details"
                  defaultValue={submitted?.details}
                  label="The project"
                  placeholder="What are you building, improving, or trying to solve?"
                  as="textarea"
                  error={errors.details}
                  onBlurValue={(v) => checkOne("details", v)}
                />
                <Field
                  name="reference"
                  defaultValue={submitted?.reference}
                  label="Current website or reference"
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  error={errors.reference}
                  onBlurValue={(v) => checkOne("reference", v)}
                  autoComplete="url"
                />
                <FileField
                  ref={fileRef}
                  file={file}
                  error={errors.file}
                  onPick={pickFile}
                  onClear={clearFile}
                />
              </>
            ) : null}

            {i === 4 ? (
              <div className="grid gap-10 bp744:grid-cols-2 bp744:gap-x-(--grid-gutter-width)">
                <Field
                  name="name"
                  defaultValue={submitted?.name}
                  label="Your name"
                  error={errors.name}
                  onBlurValue={(v) => checkOne("name", v)}
                  autoComplete="name"
                  required
                />
                <Field
                  name="company"
                  defaultValue={submitted?.company}
                  label="Company or brand"
                  hint="Optional"
                  error={errors.company}
                  onBlurValue={(v) => checkOne("company", v)}
                  autoComplete="organization"
                />
                <Field
                  name="email"
                  defaultValue={submitted?.email}
                  label="Email"
                  type="email"
                  inputMode="email"
                  error={errors.email}
                  onBlurValue={(v) => checkOne("email", v)}
                  autoComplete="email"
                  required
                />
                <Field
                  name="phone"
                  defaultValue={submitted?.phone}
                  label="Phone / WhatsApp"
                  type="tel"
                  inputMode="tel"
                  placeholder="+91 "
                  error={errors.phone}
                  onBlurValue={(v) => checkOne("phone", v)}
                  autoComplete="tel"
                  required
                />
              </div>
            ) : null}
          </div>
        </fieldset>
      ))}

      {state.status === "error" ? (
        <p role="alert" className="type-body mt-10 text-pink">
          {state.message}
        </p>
      ) : null}

      {/* What to do next, and what happens after. */}
      <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-6 border-t border-white/10 pt-8 bp1020:mt-20">
        {/*
          * Distinct keys, so React swaps the element rather than reusing it.
          * Reused, the Continue button that moves you onto the last step
          * becomes type="submit" mid-click, and the browser then sends the
          * form as that same click's default action.
          */}
        {step === LAST ? (
          <button
            key="submit"
            type="submit"
            disabled={isPending}
            className="cta cta--primary cta--lime cta--has-arrow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="cta__label">{isPending ? "Sending…" : "Start a project"}</span>
          </button>
        ) : (
          <button
            key="continue"
            type="button"
            data-step-nav
            onClick={next}
            className="cta cta--primary cta--has-arrow"
          >
            <span className="cta__label">Continue</span>
          </button>
        )}
        {step > 0 ? (
          <button
            type="button"
            data-step-nav
            onClick={() => go(step - 1)}
            className="type-eyebrow cursor-pointer text-white/55 transition-colors duration-300 hover:text-white"
          >
            Back
          </button>
        ) : null}
        <p className="type-footnote ml-auto text-white/55" aria-live="polite">
          {isPending
            ? "One moment."
            : step === LAST
              ? "We read every message ourselves, and reply to the email you give us."
              : "Nothing here is a commitment."}
        </p>
      </div>
    </form>
  );
}

/**
 * A single-answer question as a column of options on hairlines — real radio
 * inputs, so arrow keys, labels and a no-JavaScript post all behave.
 */
function Choices({
  name,
  label,
  options,
  defaultValue,
  error,
  onChoose,
}: {
  name: keyof ContactValues;
  /** Shown above the options when a step asks more than one question. */
  label?: string;
  options: readonly string[];
  defaultValue?: string;
  error?: string;
  onChoose: (value: string) => void;
}) {
  const errorId = `${name}-error`;
  const labelId = `${name}-label`;
  return (
    <div
      role="radiogroup"
      aria-labelledby={label ? labelId : undefined}
      aria-label={label ? undefined : "Choose one"}
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      {label ? (
        <p id={labelId} className={cn(LABEL, "mb-4")}>
          {label}
        </p>
      ) : null}
      <div className="grid border-b border-white/10 bp744:grid-cols-2 bp744:gap-x-(--grid-gutter-width)">
        {options.map((option) => (
          <label
            key={option}
            className="group flex cursor-pointer items-center justify-between gap-6 border-t border-white/10 py-4 text-[clamp(1.0625rem,0.95rem+0.45vw,1.375rem)] leading-snug tracking-[-0.015em] text-white/55 transition-colors duration-300 hover:text-white has-checked:text-white has-focus-visible:text-white"
          >
            <span>{option}</span>
            <input
              type="radio"
              name={name}
              value={option}
              defaultChecked={defaultValue === option}
              onChange={(e) => onChoose(e.currentTarget.value)}
              className="peer sr-only"
            />
            {/* The mark: a ring that fills when chosen. */}
            <span
              aria-hidden="true"
              className="relative size-3.5 shrink-0 rounded-full border border-current transition-colors duration-300 peer-checked:border-lime peer-checked:bg-brand-violet peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-(--color-focus)"
            />
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} className="type-footnote mt-3 text-pink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** What the sender sees once the form has done its job. */
function Outcome({ state }: { state: ContactState }) {
  const attachment =
    state.status === "sent" || state.status === "compose"
      ? state.attachment
      : undefined;

  return (
    <div role="status" aria-live="polite" className="border-t border-white/10 pt-10">
      {state.status === "sent" ? (
        <>
          <h3 className="type-subtitle1 max-w-[18ch] text-balance">
            Thank you — that&rsquo;s with us.
          </h3>
          <p className="type-body mt-6 max-w-[52ch] text-white/25">
            We&rsquo;ll read it properly and reply to the address you gave us.
            {attachment ? ` ${attachment} came through with it.` : ""} If
            it&rsquo;s urgent, {CONTACT_EMAIL} reaches us directly.
          </p>
        </>
      ) : (
        <>
          <h3 className="type-subtitle1 max-w-[18ch] text-balance">
            Your enquiry is ready to send.
          </h3>
          <p className="type-body mt-6 max-w-[52ch] text-white/25">
            The studio doesn&rsquo;t run a mail server yet, so this last step
            is yours: the button below opens an email with everything you
            filled in, already written out. Nothing has reached us until you
            send it.
          </p>
          {attachment ? (
            <p className="type-body mt-4 max-w-[52ch] text-pink">
              One thing an email link can&rsquo;t carry is the file. Please
              attach {attachment} to the message before you send it.
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={state.status === "compose" ? state.mailto : undefined}
              className="cta cta--primary cta--has-arrow"
            >
              <span className="cta__label">Open the email</span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="cta cta--inline cta--has-inline-underline type-body"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </>
      )}
    </div>
  );
}

type FieldProps = {
  name: keyof ContactValues;
  label: string;
  hint?: string;
  error?: string;
  onBlurValue: (value: string) => void;
  as?: "input" | "textarea";
  type?: string;
  inputMode?: "email" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  /** What the server sent back, so a rejected send is not retyped. */
  defaultValue?: string;
};

function Field({
  name,
  label,
  hint,
  error,
  onBlurValue,
  as = "input",
  type = "text",
  inputMode,
  placeholder,
  required,
  autoComplete,
  defaultValue,
}: FieldProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const shared = {
    id: name,
    name,
    required,
    autoComplete,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onBlurValue(e.currentTarget.value),
    className: cn(FIELD, error && "border-pink hover:border-pink focus:border-pink"),
  };

  return (
    <div className="grid content-start gap-1">
      <label htmlFor={name} className={LABEL}>
        {label}
        {hint ? (
          <span id={hintId} className="ml-3 text-white/85">
            {hint}
          </span>
        ) : required ? null : (
          <span className="sr-only"> (optional)</span>
        )}
      </label>

      {as === "textarea" ? (
        <textarea
          {...shared}
          rows={4}
          defaultValue={defaultValue}
          className={cn(shared.className, "resize-y")}
        />
      ) : (
        <input
          {...shared}
          type={type}
          inputMode={inputMode}
          defaultValue={defaultValue}
        />
      )}

      {error ? (
        <p id={errorId} className="type-footnote mt-2 text-pink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The attachment.
 *
 * The input itself is the label's own control, visually hidden, and the label
 * is what gets drawn. It stays a real `<input type="file">`, so the keyboard,
 * the file picker and a no-JavaScript post all behave.
 */
function FileField({
  ref,
  file,
  error,
  onPick,
  onClear,
}: {
  ref: React.RefObject<HTMLInputElement | null>;
  file: File | null;
  error?: string;
  onPick: (file: File | null) => void;
  onClear: () => void;
}) {
  const hintId = "file-hint";
  const errorId = "file-error";

  return (
    <div className="grid gap-3">
      <span className={LABEL}>
        A file<span className="sr-only"> (optional)</span>
      </span>
      <p id={hintId} className="type-footnote text-white/55">
        A brief, a reference, a document or an existing design.{" "}
        {FILE_EXTENSIONS.join(", ")}, up to {MAX_FILE_LABEL}.
      </p>

      <div className="flex flex-wrap items-center gap-5">
        <label
          className={cn(
            "type-eyebrow inline-flex cursor-pointer items-center border border-white/20 px-5 py-3.5 text-white transition-colors duration-300 select-none hover:border-black focus-within:border-black",
            error && "border-pink hover:border-pink",
          )}
        >
          Choose a file
          <input
            ref={ref}
            type="file"
            id="file"
            name="file"
            accept={FILE_ACCEPT}
            aria-describedby={[hintId, error ? errorId : null]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={error ? true : undefined}
            onChange={(e) => onPick(e.currentTarget.files?.[0] ?? null)}
            className="sr-only"
          />
        </label>

        {file ? (
          <span className="type-footnote flex items-center gap-3 text-white/25">
            <span className="break-all">{file.name}</span>
            <button
              type="button"
              onClick={onClear}
              className="cta cta--inline cta--has-inline-underline text-white/55"
            >
              Remove
            </button>
          </span>
        ) : (
          <span className="type-footnote text-white/85">No file chosen</span>
        )}
      </div>

      {error ? (
        <p id={errorId} className="type-footnote text-pink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
