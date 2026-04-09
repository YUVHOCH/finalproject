import React from "react";
import styles from "../styles/About.module.css";

const About = () => {
  return (
    <main className={styles.about}>
      <div className={styles.inner}>
        <h1 className={styles.title}>אודות Bizpoint</h1>

        <div className={styles.body}>
          <p>
            חברת Bizpoint הוקמה בשנת 2000, ונחשבת מחלוצות תחום ה־E-Commerce B2C ו־B2B בישראל.
            החברה הקימה והפעילה לאורך השנים אתרי סחר, מועדוני לקוחות ופתרונות מכירה מתקדמים עבור
            גופים מובילים במשק.
          </p>
          <p>
            בשנים האחרונות הובילה Bizpoint את הקמת מערך הסחר והשיווק הדיגיטלי של חברת הגרעין –
            כולל הקמת אתר B2C, אתר B2B, אתרי מותג ואתרי סחר לסניפים, לצד ניהול קטלוגים, מבצעים
            ואינטגרציה למערכות ERP.
          </p>
          <p>
            Bizpoint מתמחה בהקמת אתרי E-Commerce מתקדמים המשלבים חוויית משתמש, שיווק ואוטומציות
            מכירה – במטרה לבנות מערכות שמוכרות בפועל, ולא רק נראות טוב.
          </p>
        </div>

        <div className={styles.contactBox}>
          <p className={styles.contactTitle}>ליצירת קשר</p>
          <a href="tel:050-9130999" className={styles.contactLink}>
            טלפון: 050-9130999
          </a>
          <a href="mailto:yuval@bizpoint.co.il" className={styles.contactLink}>
            מייל: yuval@bizpoint.co.il
          </a>
        </div>
      </div>
    </main>
  );
};

export default About;
