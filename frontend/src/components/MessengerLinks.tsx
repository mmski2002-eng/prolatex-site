const LINKS = {
  whatsapp: "https://wa.me/79629101580",
  telegram: "https://t.me/ProLatex",
  max: "https://max.ru/",
};

const WA_PATH =
  "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.25 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z";

const TG_PATH =
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.64 6.86-1.66 7.83c-.12.55-.45.69-.91.43l-2.52-1.86-1.22 1.17c-.13.14-.25.25-.51.25l.18-2.57 4.68-4.23c.2-.18-.04-.28-.32-.1l-5.78 3.64-2.49-.78c-.54-.17-.55-.54.11-.8l9.74-3.76c.45-.16.85.11.7.78Z";

/* контур фирменного знака MAX (max.ru/favicon.svg) */
const MAX_PATH =
  "M50.7571 0.261719C78.2929 0.261719 99.8857 22.5974 99.8857 50.1474C99.8857 77.6974 77.6071 99.4903 51.0214 99.4903C41.5857 99.4903 37.0143 98.1617 29.65 92.9474C29.1429 92.5903 28.45 92.6831 28.0214 93.1403C22.3571 99.1831 7.85 103.426 7.18571 95.176C7.18571 80.7903 0 71.4474 0 49.876C0 21.5546 23.2214 0.261719 50.7571 0.261719ZM51.5286 24.8117C38.4643 24.126 28.2643 33.1974 26.0143 47.3831C24.15 59.1332 27.45 73.4546 30.2786 74.176C31.4786 74.4832 34.3571 72.276 36.4571 70.2974C36.85 69.926 37.45 69.8617 37.9071 70.1474C41.1786 72.1474 44.8786 73.6474 48.9571 73.8617C62.3714 74.5617 74.2571 64.0617 74.9643 50.6474C75.6643 37.2331 64.9429 25.5046 51.5286 24.8046V24.8117Z";

export default function MessengerLinks({ iconsOnly = false }: { iconsOnly?: boolean }) {
  const gradientId = `plx-max-gradient-${iconsOnly ? "compact" : "full"}`;
  return (
    <div className={`messengers${iconsOnly ? " messengers-compact" : ""}`}>
      <a
        className="messenger messenger-wa"
        href={LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в WhatsApp"
        title="WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path fill="currentColor" d={WA_PATH} />
        </svg>
        {!iconsOnly && <span>WhatsApp</span>}
      </a>
      <a
        className="messenger messenger-tg"
        href={LINKS.telegram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в Telegram"
        title="Telegram"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path fill="currentColor" d={TG_PATH} />
        </svg>
        {!iconsOnly && <span>Telegram</span>}
      </a>
      <a
        className="messenger messenger-max"
        href={LINKS.max}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в MAX"
        title="MAX"
      >
        <svg viewBox="0 0 100 100" width="19" height="19" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={gradientId} x1="8" y1="92" x2="92" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#00EAFF" />
              <stop offset="0.45" stopColor="#1591FF" />
              <stop offset="1" stopColor="#8419FF" />
            </linearGradient>
          </defs>
          <path fillRule="evenodd" clipRule="evenodd" fill={`url(#${gradientId})`} d={MAX_PATH} />
        </svg>
        {!iconsOnly && <span>MAX</span>}
      </a>
    </div>
  );
}
