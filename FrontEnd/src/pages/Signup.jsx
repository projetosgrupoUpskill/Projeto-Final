import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  useAuth  from "../context/AuthContext";
import { createPortal } from "react-dom";
import PasswordInput from "../components/PasswordInput";

import styles from "../components/styles/authForm.module.css";

export function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTerms, setShowTerms] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!formData.terms) {
      setError("Você deve aceitar os termos e condições.");
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);

      setSuccess("Conta criada com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (error) {
      setError("");
    }
  };

  return (
    <AuthLayout
      subtitle="Crie sua conta para começar a gerenciar suas finanças!"
      footer={
        <>
          Já tem uma conta?
          <a href="/login" className={styles.link}>
            Fazer login
          </a>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        {success && <p style={{ color: "green", marginBottom: "1rem" }}>{success}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nome Completo
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Digite seu nome"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Senha
          </label>

          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirmar Senha
          </label>

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>

        <div className={styles.checkboxGroup}>
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className={styles.checkbox}
            checked={formData.terms}
            onChange={handleChange}
          />

          <label htmlFor="terms" className={styles.checkboxLabel}>
            Eu concordo com os {" "}
            <button
              type="button"
              className={styles.modalTrigger}
              onClick={() => setShowTerms("terms")}
            >
              Termos de Serviço
            </button>{" "}
            e{" "}
            <button
              type="button"
              className={styles.modalTrigger}
              onClick={() => setShowTerms("privacy")}
            >
              Política de Privacidade
            </button>
          </label>
        </div>

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      {showTerms && createPortal(
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTerms(null);
          }}
        >
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {showTerms === "terms" ? "Termos de Serviço" : "Política de Privacidade"}
            </h3>

            <div className={styles.modalBody}>
              {showTerms === "terms" ? (
                <>
                  <p>
                    Bem-vindo ao Money Hub. Ao criar uma conta, você concorda em utilizar
                    a plataforma de forma responsável, fornecendo informações verdadeiras
                    sobre as suas transações e mantendo as suas credenciais de acesso em
                    segurança.
                  </p>
                  <p>
                    O Money Hub é fornecido como está, para fins de organização financeira
                    pessoal. Não nos responsabilizamos por decisões financeiras tomadas com
                    base nos dados apresentados na plataforma.
                  </p>
                  <p>
                    Reservamo-nos o direito de atualizar estes termos a qualquer momento.
                    Alterações relevantes serão comunicadas através da própria plataforma.
                  </p>
                  <p>
                    O uso continuado da conta após alterações nos termos implica a aceitação
                    das novas condições.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    A sua privacidade é importante para nós. O Money Hub recolhe apenas os
                    dados necessários para o funcionamento da aplicação: nome, email e as
                    transações que você inserir manualmente.
                  </p>
                  <p>
                    Os seus dados financeiros não são partilhados com terceiros e são usados
                    exclusivamente para apresentar os seus próprios relatórios e gráficos
                    dentro da plataforma.
                  </p>
                  <p>
                    Pode solicitar a eliminação da sua conta e de todos os dados associados
                    a qualquer momento, através das definições da conta.
                  </p>
                  <p>
                    Utilizamos cookies apenas para manter a sua sessão autenticada, não para
                    fins de publicidade ou rastreamento.
                  </p>
                </>
              )}
            </div>

            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setShowTerms(null)}
            >
              Fechar
            </button>
          </div>
        </div>,
        document.body
      )}

    </AuthLayout>
  );
}