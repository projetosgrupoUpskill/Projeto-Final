import { useState } from "react";
import { useNavigate } from "react-router";
/* import { useAuth } from "../context/AuthContext"; */
import styles from "../components/styles/authForm.module.css";
import { AuthLayout } from "../components/AuthLayout";

export function Login() {
  const navigate = useNavigate();
/*   const { login } = useAuth(); */
 const login = async (email, password) => {
    console.log(email, password);
  };    

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      alert("Erro ao fazer login. Tente novamente.");
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

  return (
    <AuthLayout
        subtitle= "Bem-vindo de volta! Faça login para acessar sua conta."
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

            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.forgotPassword}>
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

    </AuthLayout>
  );
}