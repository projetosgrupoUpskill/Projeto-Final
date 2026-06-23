import { useState } from "react";
import { useNavigate } from "react-router";
import  useAuth  from "../context/AuthContext";
import styles from "../components/styles/authForm.module.css";
import { AuthLayout } from "../components/AuthLayout";
import { createPortal } from "react-dom";
import PasswordInput from "../components/PasswordInput";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      setError(error.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setResetEmail("");
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setResetSent(true);
  };

  return (
    <AuthLayout
      subtitle="Bem-vindo de volta! Faça login para acessar sua conta."
      footer={
        <>
          Não tem uma conta?
          <a href="/cadastro" className={styles.link}>
            Criar conta
          </a>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
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
            required
          />
        </div>

        <div className={styles.forgotPassword}>
          <button type="button" onClick={() => setShowForgotPassword(true)}>
            Esqueceu a senha?
          </button>
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {showForgotPassword && createPortal(
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForgotPassword();
          }}
        >
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Recuperar Senha</h3>

            {resetSent ? (
              <div className={styles.modalBody}>
                <p>
                  Se o email <strong>{resetEmail}</strong> estiver associado a uma conta,
                  vai receber um link para redefinir a sua senha em breve.
                </p>
              </div>
            ) : (
              <form
                id="forgotPasswordForm"
                onSubmit={handleForgotPasswordSubmit}
                className={styles.modalBody}
              >
                <p>
                  Indique o email da sua conta. Vamos enviar um link para você redefinir
                  a sua senha.
                </p>
                <div className={styles.formGroup}>
                  <label htmlFor="resetEmail" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    placeholder="seu@email.com"
                    className={styles.input}
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              </form>
            )}

            <div className={styles.modalActions}>
              {!resetSent && (
                <button type="submit" form="forgotPasswordForm" className={styles.button}>
                  Enviar link de recuperação
                </button>
              )}
              <button
                type="button"
                className={styles.modalCloseBtnDanger}
                onClick={closeForgotPassword}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </AuthLayout>
  );
}