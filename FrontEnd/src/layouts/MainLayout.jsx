import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../App.module.css";

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
          <Header />
        <main style={{ minHeight: '70vh' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;