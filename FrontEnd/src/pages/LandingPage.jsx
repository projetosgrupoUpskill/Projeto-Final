import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import styles from "../components/styles/LandingPage.module.css";
import {
  FiPieChart,
  FiTrendingUp,
  FiSmartphone,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";

const benefits = [
  {
    img: "src/assets/control_total.svg",
    title: "Controlo Total das Finanças",
    text: "Veja para onde vai cada euro, com categorias e gráficos atualizados automaticamente a cada transação.",
  },
  {
    img: "src/assets/insights.svg",
    title: "Decisões Mais Inteligentes",
    text: "Receba insights personalizados sobre os seus hábitos de consumo e descubra onde pode poupar mais.",
  },
  {
    img: "src/assets/acess_anyhere.svg",
    title: "Acesso em Qualquer Lugar",
    text: "Uma plataforma simples e acessível, pensada para acompanhar as suas finanças onde quer que esteja.",
  },
];

const testimonials = [
  {
    name: "Joana M.",
    role: "Estudante",
    text: "Finalmente consigo ver para onde vai o meu dinheiro todos os meses. Os gráficos ajudaram-me a perceber que gastava demasiado em compras por impulso.",
    rating: 5,
  },
  {
    name: "Ricardo P.",
    role: "Freelancer",
    text: "Uso o Money Hub há 3 meses e já consegui poupar mais do que em todo o ano passado. O assistente é surpreendentemente útil.",
    rating: 5,
  },
  {
    name: "Beatriz C.",
    role: "Recém-licenciada",
    text: "Simples e direto. Não perco tempo a preencher folhas de cálculo, e tenho sempre o saldo atualizado na palma da mão.",
    rating: 4,
  },
  {
    name: "Tiago A.",
    role: "Pequeno empresário",
    text: "A categorização automática poupa-me horas todos os meses. Recomendo a quem está a começar a organizar as finanças.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "O que é o Money Hub?",
    answer:
      "É uma aplicação de gestão financeira pessoal que ajuda a acompanhar receitas, despesas e poupanças de forma simples e visual.",
  },
  {
    question: "Os meus dados financeiros estão seguros?",
    answer:
      "Sim. Os seus dados ficam guardados de forma segura, associados apenas à sua conta, e nunca são partilhados com terceiros.",
  },
  {
    question: "Posso usar o Money Hub no telemóvel?",
    answer:
      "Sim, a aplicação foi pensada para funcionar bem tanto no computador como no telemóvel, sem precisar de instalar nada.",
  },
  {
    question: "Como as transações são adicionadas?",
    answer:
      "As transações são adicionadas manualmente de forma rápida, e os gráficos e o assistente atualizam-se automaticamente a partir delas.",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function LandingPage() {
  const { theme } = useContext(ThemeContext);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const goToTestimonial = (index) => {
    const total = testimonials.length;
    setActiveTestimonial(((index % total) + total) % total);
  };

  const current = testimonials[activeTestimonial];

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            Controle suas finanças,
            <br />
            <strong>sem complicações.</strong>
          </h1>

          <p className={styles.subtitle}>
            A app inteligente que simplifica o teu orçamento e gere os teus
            gastos num só lugar.
          </p>

          <div className={styles.btnGroup}>
            <Link to="/cadastro" className={styles.btnPrimary}>
              Registrar-se
            </Link>
            <Link to="/login" className={styles.btnSecondary}>
              Iniciar Sessão
            </Link>
          </div>
        </div>

        <div className={styles.right}>
          <img
            src={theme === "dark" ? "/src/assets/mock_dark.svg" : "/src/assets/mock_light.svg"}
            alt="Dashboard Money Hub no computador e no telemóvel"
            className={styles.imgDevices}
          />
        </div>
      </section>

      {/* ── O que é o Money Hub? ── */}
      <section className={styles.section}>
        <div className={styles.aboutBox}>
          <h2 className={styles.aboutTitle}>O que é o Money Hub?</h2>
          <p className={styles.aboutText}>
            O Money Hub foi desenvolvido para ajudar qualquer pessoa a
            organizar as suas finanças pessoais de forma simples e direta.
            Combinamos categorização automática, gráficos claros e um
            assistente inteligente, permitindo que os usuários:
          </p>
          <ul className={styles.aboutList}>
            <li>
              Acompanhem receitas e despesas em tempo real, com gráficos
              sempre atualizados.
            </li>
            <li>
              Organizem os gastos por categoria, identificando rapidamente
              onde o dinheiro está a ser usado.
            </li>
            <li>
              Recebam insights e sugestões personalizadas para poupar mais,
              através do assistente.
            </li>
          </ul>
          <p className={styles.aboutText}>
            O Money Hub transforma a gestão financeira numa tarefa simples,
            ajudando a entender melhor os seus hábitos, planear o futuro e
            tomar decisões mais conscientes sobre o seu dinheiro.
          </p>
        </div>
      </section>

      {/* ── Benefícios ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Benefícios</h2>
        <div className={styles.benefitsGrid}>
          {benefits.map((b) => (
            <div key={b.title} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src={b.img} alt={b.title} className={styles.benefitImage}/>
              </div>
              <h3 className={styles.benefitTitle}>{b.title}</h3>
              <p className={styles.benefitText}>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Histórias Reais ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Histórias Reais </h2>
        <p className={styles.sectionSubtitle}>
          Como o Money Hub ajudou os nossos usuários
        </p>

        <div className={styles.testimonialWrapper}>
          <button
            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
            onClick={() => goToTestimonial(activeTestimonial - 1)}
            aria-label="Depoimento anterior"
          >
            <FiChevronLeft size={18} />
          </button>

          <div className={styles.testimonialCard}>
            <div className={styles.avatarCircle}>{getInitials(current.name)}</div>
            <h3 className={styles.testimonialName}>{current.name}</h3>
            <p className={styles.testimonialRole}>{current.role}</p>
            <p className={styles.testimonialText}>&ldquo;{current.text}&rdquo;</p>
            <div className={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  size={18}
                  className={i < current.rating ? styles.starFilled : styles.starEmpty}
                />
              ))}
            </div>
          </div>

          <button
            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
            onClick={() => goToTestimonial(activeTestimonial + 1)}
            aria-label="Próximo depoimento"
          >
            <FiChevronRight size={18} />
          </button>
        </div>

        <div className={styles.dotsRow}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeTestimonial ? styles.dotActive : ""}`}
              onClick={() => goToTestimonial(i)}
              aria-label={`Ver depoimento ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Perguntas Frequentes (FAQ)</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={faq.question} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <FiChevronDown
                    size={18}
                    className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ""}`}
                  />
                </button>
                {isOpen && <p className={styles.faqAnswer}>{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}