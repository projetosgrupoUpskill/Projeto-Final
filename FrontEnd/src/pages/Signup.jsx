import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../components/styles/authForm.module.css";

export function Signup() {
    const navigate = useNavigate();

    /*   const { login } = useAuth(); */
    const Signup = async (name, email, password) => {
        console.log(name, email, password);
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        if (!formData.terms) {
            alert("Você deve aceitar os termos e condições.");
            return;
        }

        setIsLoading(true);

        try {
            await Signup(
                formData.name,
                formData.email,
                formData.password);

            navigate("/");
        } catch (error) {
            alert("Erro ao criar conta. Tente novamente.");
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

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className={styles.input}
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label
                        htmlFor="confirmPassword"
                        className={styles.label}
                    >
                        Confirmar Senha
                    </label>

                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={styles.input}
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

                    <label
                        htmlFor="terms"
                        className={styles.checkboxLabel}
                    >
                        Eu concordo com os{" "}
                        <a href="#">Termos de Serviço</a> e{" "}
                        <a href="#">Política de Privacidade</a>
                    </label>
                </div>

                <button
                    type="submit"
                    className={styles.button}
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Criando conta..."
                        : "Criar Conta"}
                </button>
            </form>
        </AuthLayout>
    );
}