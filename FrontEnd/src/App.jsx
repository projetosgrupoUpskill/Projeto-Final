import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import ContactCard from "./pages/Contact";
import {
  PreferencesContext,
  PreferencesProvider,
} from "./context/PreferencesContext";
import { ThemeProvider } from "./context/ThemeContext";
import Settings from "./pages/Settings";
import { useContext, useEffect } from "react";
import Details from "./pages/History";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PreferencesProvider>
          <Router>
            <Routes>
              {/* O MainLayout contém o Header, Navbar e Footer */}
              <Route path="/" element={<MainLayout />}>
                {/* Painel - Página Principal */}
                <Route index element={<Dashboard />} />

                <Route path="adicionar" element={<AddTransaction />} />
                <Route path="details" element={<Details />} />
                <Route path="about" element={<ContactCard />} />
                <Route path="settings" element={<Settings />} />

                {/* Redirecionamento se a rota não existir */}
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            </Routes>
          </Router>
        </PreferencesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
