import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import { ThemeContext } from "../context/ThemeContext";
import styles from "../components/styles/Settings.module.css";
import Card from "../components/Card";

export default function Settings() {
  const { currency, setCurrency, userName, setUserName } =
    useContext(PreferencesContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={styles.settingsContainer}>
      <Card title="Definições">
        
        {/* Tema Visual */}
        <div className={styles.settingItem}>
          <div className={styles.settingText}>
            <h3 className={styles.settingTitle}>Ativar Dark Mode</h3>
            <p className={styles.settingDesc}>Aparência da interface</p>
          </div>
          <button 
            className={styles.toggleSwitch} 
            data-active={theme === "dark"}
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
          </button>
        </div>

        {/* Moeda Principal */}
        <div className={styles.settingItem}>
          <div className={styles.settingText}>
            <h3 className={styles.settingTitle}>Moeda</h3>
            <p className={styles.settingDesc}>Formato da Moeda</p>
          </div>
          <select 
            className={styles.select} 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="EUR">EUR - Euro (€)</option>
            <option value="USD">USD - Dólar ($)</option>
            <option value="GBP">GBP - Libra (£)</option>
            <option value="BRL">BRL - Real (R$)</option>
          </select>
        </div>

        {/* Nome do Utilizador */}
        <div className={styles.settingItem}>
          <div className={styles.settingText}>
            <h3 className={styles.settingTitle}>Nome de Utilizador</h3>
            <p className={styles.settingDesc}>Como devemos te chamar?</p>
          </div>
          <input
            className={styles.input}
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Digite o teu nome..."
          />
        </div>

      </ Card>
    </div>
  );
}