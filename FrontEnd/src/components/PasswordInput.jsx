import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./styles/AuthForm.module.css";

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  minLength,
}) {
  const [visible, setVisible] = useState(false);

  const handleChange = (e) => {
    if (visible) setVisible(false);
    onChange(e);
  };

  return (
    <div className={styles.passwordField}>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className={`${styles.input} ${styles.passwordInput}`}
        value={value}
        onChange={handleChange}
        minLength={minLength}
        required={required}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Esconder senha" : "Mostrar senha"}
      >
        {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  );
}