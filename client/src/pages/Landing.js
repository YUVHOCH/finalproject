import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/Landing.module.css";
import bulletImg from "../assets/BULETBIZ.png";
import { SHOW_SCREEN_EXAMPLES } from "../landingFlags";

const SECTION_ID = {
  hero: "hero",
  why: "why",
  what: "what",
  screens: "screens",
  tech: "tech",
  contact: "contact",
};

const Landing = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (location.hash !== "#contact") return;
    const el = document.getElementById("contact");
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.pathname, location.hash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className={styles.landing}>
      {/* Hero */}
      <section id={SECTION_ID.hero} className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
           E-Commerce B2C/B2B
            <br />
            25 שנות ניסיון
          </h1>
          <p className={styles.heroSub}>
            <span className={styles.heroSubFirst}>
              בונים לכם אתר מרצדס: מהיר, ממוקד מכירות, UX מוקפד ואוטומציות מובנות – מותאם בדיוק לצרכים העסקיים והשיווקיים שלכם.
            </span>
            <span className={styles.heroSubSecond}>
              25 שנות התמחות בהקמת אתרים, במסחר ובשיווק באינטרנט,
              <br />
              כדי לעזור לכם לאפיין נכון ולמכור יותר.
            </span>
          </p>
        </div>
      </section>

      <section
        id={SECTION_ID.what}
        className={styles.whatStrip}
        style={{ "--bullet-img": `url(${bulletImg})` }}
      >
        <div className={styles.whatStripInner}>
          <ul className={styles.whatBulletList}>
            <li>
              <span className={styles.whatBulletLead}>אתר מהיר ויציב</span>
              {" "}– חוויית גלישה חלקה שממירה לרכישה
            </li>
            <li>
              <span className={styles.whatBulletLead}>UX מקצועי</span>
              {" "}– ניווט ברור, עמודי מוצר ועגלה מותאמים למכירה
            </li>
            <li>
              <span className={styles.whatBulletLead}>מבצעים ואוטומציות</span>
              {" "}– הנחות, קופונים, המלצות והנעה לפעולה
            </li>
            <li>
              <span className={styles.whatBulletLead}>ממשק ניהול פשוט ונוח</span>
              {" "}– לניהול ועריכת תוכן מהירה במיוחד.
            </li>
            <li>
              <span className={styles.whatBulletLead}>אינטגרציה מלאה ל־ERP</span>
              {" "}ברמת המחירים, מלאים, הזמנות, קבלות וכד׳.
            </li>
            <li>
              <span className={styles.whatBulletLead}>קוד מותאם</span>
              {" "}– React ו־Node.js, לא תבניות גנריות
            </li>
          </ul>
        </div>
      </section>

      {/* Why Bizpoint */}
      <section id={SECTION_ID.why} className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>למה Bizpoint?</h2>
          <div className={styles.cards}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>📅</span>
              <h3>25 שנות ניסיון</h3>
              <p>	הקמה וניהול של אתרי סחר, אפיון והקמת אתרי B2C ו B2B מותאמים לקהל היעד של הלקוח. התמחות במסחר ושיווק באינטרנט, נוכל להמליץ לכם כיצד לאפיין ולהגדיל את המכירות .</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🚀</span>
              <h3>אתר ברמת מרצדס</h3>
              <p>אתר מהיר, ממוקד מכירות, UX מוקפד – לא תבנית גנרית. מותאם אישית ללקוח. אנחנו בונים עם React ו־Node.js קוד מותאם אישית.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>⚡</span>
              <h3>אוטומציות ומבצעים</h3>
              <p>מערכות קידום מכירות ואוטומציה מובנות – כדי שהאתר יעבוד בשבילכם 24/7.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔄</span>
              <h3>התמחות ב B2C ו B2B</h3>
              <p>פלטפורמה אחת או נפרדת לקמעונאות ולסיטונאות – אתרים מורכבים שמדברים עם הצרכים המסחריים והשיווקיים.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔗</span>
              <h3>אינטגרציה ל־ERP</h3>
              <p>אינטגרציה מלאה ל־ERP ברמת המחירים, מלאים, הזמנות, קבלות וכד׳.​ התממשקות באמצעות דטה בייס משותף ו/או און ליין.
</p>
            </div>
          </div>
        </div>
      </section>

      {SHOW_SCREEN_EXAMPLES && (
        <section id={SECTION_ID.screens} className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>דוגמאות ממסכים</h2>
            <div className={styles.screensGrid}>
              <div className={styles.screenCard}>
                <div className={styles.screenImageWrap}>
                  <img
                    src={`${process.env.PUBLIC_URL}/screenshots/productpge.jpg`}
                    alt="עמוד מוצר מתקדם"
                  />
                </div>
                <p className={styles.screenCaption}>
                  <strong>עמוד מוצר מתקדם</strong> – גלריה, וריאציות, המלצות ומבצעים, ממוקד המרה.
                </p>
              </div>
              <div className={styles.screenCard}>
                <div className={styles.screenImageWrap}>
                  <img
                    src={`${process.env.PUBLIC_URL}/screenshots/CART.jpg`}
                    alt="עגלה ומבצעים"
                  />
                </div>
                <p className={styles.screenCaption}>
                  <strong>עגלה + מבצעים</strong> – הנחות דינמיות, קופונים והנעה להשלמת רכישה.
                </p>
              </div>
              <div className={styles.screenCard}>
                <div className={styles.screenImageWrap}>
                  <img
                    src={`${process.env.PUBLIC_URL}/screenshots/B2B.jpg`}
                    alt="B2B"
                  />
                </div>
                <p className={styles.screenCaption}>
                  <strong>B2B</strong> – ממשק סיטונאי, מחירוניות, הזמנות כמותיות והרשאות לפי תפקיד.
                </p>
              </div>
              <div className={styles.screenCard}>
                <div className={styles.screenImageWrap}>
                  <img
                    src={`${process.env.PUBLIC_URL}/screenshots/SALES.jpg`}
                    alt="שיווק"
                  />
                </div>
                <p className={styles.screenCaption}>
                  <strong>שיווק</strong> – קמפיינים, באנרים וכלים לקידום מכירות באתר.
                </p>
              </div>
              <div className={`${styles.screenCard} ${styles.screenCardFull}`}>
                <div className={styles.screenImageWrap}>
                  <img
                    src={`${process.env.PUBLIC_URL}/screenshots/ADMIN.jpg`}
                    alt="ממשק ניהול"
                  />
                </div>
                <p className={styles.screenCaption}>
                  <strong>אדמין</strong> – ניהול מוצרים, מלאי, משתמשים ומבצעים, שליטה מלאה בעסק.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact / CTA */}
      <section id={SECTION_ID.contact} className={`${styles.section} ${styles.contactSection}`}>
        <div className={styles.container}>
          <div className={styles.contactPanel}>
            <h2 className={styles.sectionTitle}>צרו קשר</h2>
            <p className={styles.sectionIntro}>
              רוצים אתר איקומרס מקצועי או שדרוג לאתר קיים?
              <br />
              השאירו פרטים ונחזור אליכם בהקדם.
            </p>
            {submitted ? (
              <div className={styles.successMsg}>תודה! נחזור אליכם בהקדם.</div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="שם / חברה"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="אימייל"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <textarea
                  name="message"
                  placeholder="הודעה"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={4}
                />
                <button type="submit" className={styles.contactSubmitBtn}>
                  שלח בקשת הצעה
                </button>
              </form>
            )}
            <div className={styles.contactDirect}>
              <p className={styles.contactDirectTitle}>ליצירת קשר:</p>
              <a href="mailto:yuval@bizpoint.co.il" className={styles.contactDirectLink}>
                yuval@bizpoint.co.il
              </a>
              <a href="tel:050-9130999" className={styles.contactDirectLink}>
                050-9130999
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
