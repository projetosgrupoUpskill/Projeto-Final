import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import useAuth from "../context/AuthContext";
import { deleteAccount } from "../api";
import styles from "../components/styles/Settings.module.css";
import Card from "../components/Card";
import ConfirmModal from "../components/ConfirmModal";
import PasswordInput from "../components/PasswordInput";
import toast from "react-hot-toast";

export default function Settings() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openDeleteModal = () => {
      setConfirmPassword("");
      setDeleteError("");
      setIsDeleting(true);
    };

    const closeDeleteModal = () => {
      setIsDeleting(false);
      setConfirmPassword("");
      setDeleteError("");
    };

    const handleConfirmDelete = async () => {
      if (!confirmPassword) {
        setDeleteError("Por favor, insira a sua password para confirmar.");
        return;
      }

      setIsSubmitting(true);
      setDeleteError("");
      
      try {
        await deleteAccount(confirmPassword);
        setIsSubmitting(false);
        toast.success("Conta eliminada com sucesso.");
        logout();
        navigate("/login");
      } catch (error) {
        setDeleteError(error.message || "Erro ao eliminar conta. Tenta novamente.");
        setIsSubmitting(false);
      }
    };

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
            <p className={styles.settingDesc}>
            No momento, apenas o Euro está disponível. Em breve, será possivel fazer a conversão automaticamente entre diferentes moedas.
            </p>
          </div>
          <select 
            className={styles.select} 
            value="EUR"
            disabled
            title="Em breve: Conversão entre moedas"
          >
            <option value="EUR">EUR - Euro (€)</option>
            {/* Código para atualização futura
            <option value="USD">USD - Dólar ($)</option>
            <option value="GBP">GBP - Libra (£)</option>
            <option value="BRL">BRL - Real (R$)</option> */}
          </select>
        </div>

        {/* Eliminar Conta */}
        <div className={styles.settingItem}>
          <div className={styles.settingText}>
            <h3 className={styles.settingTitle}>Eliminar Conta</h3>
            <p className={styles.settingDesc}>
              Apaga a tua conta e todos os teus dados permanentemente
            </p>
          </div>
          <button
            className={styles.dangerButton}
            onClick={openDeleteModal}
          >
            Eliminar Conta
          </button>
        </div>

      </ Card>
      <ConfirmModal
        isOpen={isDeleting}
        title="Eliminar conta"
        message={
          <>
            Tem certeza de que deseja excluir sua conta? Esta ação é irreversível. Você perderá{" "}
            <strong>todas as suas transações e o acesso ao site de forma permanente</strong>.
          </>
        }
        subMessage="Esta ação não pode ser desfeita."
        confirmLabel={isSubmitting ? "A eliminar..." : "Eliminar conta"}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      >
        <div className={styles.modalPasswordField}>
          <label htmlFor="confirmPassword" className={styles.modalPasswordLabel}>
            Confirma a tua password
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (deleteError) setDeleteError("");
            }}
          />
          {deleteError && (
            <p className={styles.modalPasswordError}>{deleteError}</p>
          )}
        </div>
      </ConfirmModal>
    </div>
  );
}