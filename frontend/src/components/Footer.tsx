import Link from "next/link";
import Image from "next/image";
import MessengerLinks from "@/components/MessengerLinks";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <Image src="/logo-400.png" alt="Про-Латекс" width={140} height={34} style={{ height: 34, width: "auto" }} />
            </div>
            <p>
              Матрасы, подушки и тонкие матрасы из 100% натурального бельгийского
              латекса. Специалист по натуральному латексу. Компания основана в 2009 году.
            </p>
          </div>
          <div className="footer-col">
            <h5>Каталог</h5>
            <ul>
              <li><Link href="/matrasy/">Все матрасы</Link></li>
              <li><Link href="/matrasy/pruzhinnye/">Пружинные матрасы</Link></li>
              <li><Link href="/matrasy/bespruzhinnye/">Беспружинные матрасы</Link></li>
              <li><Link href="/podushki/">Латексные подушки</Link></li>
              <li><Link href="/toppery/">Тонкие латексные матрасы</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Компания</h5>
            <ul>
              <li><Link href="/tehnologii/">Технология Dunlop</Link></li>
              <li><Link href="/o-latekse/">О латексе</Link></li>
              <li><Link href="/proizvodstvo/">Производство</Link></li>
              <li><Link href="/podbor/">Подбор матраса</Link></li>
              <li><Link href="/blog/">Блог</Link></li>
              <li><Link href="/o-kompanii/">О компании</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Контакты</h5>
            <ul>
              <li><a href="tel:88047007750">8 (804) 700-77-50</a></li>
              <li><a href="mailto:info@pro-latex.ru">info@pro-latex.ru</a></li>
              <li className="footer-messengers"><MessengerLinks iconsOnly /></li>
              <li>Склады: Москва и Санкт-Петербург</li>
              <li><Link href="/dostavka-i-oplata/">Доставка и оплата</Link></li>
              <li><Link href="/kontakty/">Контакты</Link></li>
              <li><Link href="/optovym-klientam/">Оптовым клиентам</Link></li>
              <li><Link href="/politika-konfidencialnosti/">Политика конфиденциальности</Link></li>
              <li><Link href="/polzovatelskoe-soglashenie/">Пользовательское соглашение</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2009–2026 Про-Латекс. Матрасы из натурального латекса.</span>
          <span>ИП Карцев Алексей Сергеевич · ИНН&nbsp;504905850767 · ОГРНИП&nbsp;324508100606552</span>
          <span>pro-latex.ru</span>
        </div>
      </div>
    </footer>
  );
}
