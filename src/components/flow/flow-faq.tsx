import { FlowReveal } from "./flow-reveal";
import styles from "./flow.module.css";

/*
 * Questions on the black run, each a disclosure that opens smoothly in the
 * browsers that can animate to `auto` and simply opens in the others.
 */
export function FlowFaq({
  eyebrow,
  title,
  faqs,
}: {
  eyebrow: string;
  title: string;
  faqs: Array<{ question: string; answer: string }>;
}) {
  return (
    <section id="faq" className={styles.chapter} aria-labelledby="faq-title">
      <FlowReveal as="p" className={styles.chapterEyebrow}>
        {eyebrow}
      </FlowReveal>
      <div className={styles.chapterMain}>
        <FlowReveal as="h2" className={styles.chapterTitle} index={1}>
          <span id="faq-title">{title}</span>
        </FlowReveal>
        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <FlowReveal key={faq.question} index={i % 4}>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{faq.question}</summary>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </details>
            </FlowReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
