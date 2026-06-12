import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import ContactCard from "./pages/Contact";
import { PreferencesProvider } from "./context/PreferencesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Settings from "./pages/Settings";
import Details from "./pages/History";
import { Login } from "./pages/login";
import { Signup } from "./pages/Signup";
import ChatbotButton from "./components/ChatbotButton";
import ChatWidget from "./components/ChatWidget";

const queryClient = new QueryClient();

// Proteção para rotas que precisam de autenticação
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PreferencesProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* O MainLayout contém o Header, Navbar e Footer */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <MainLayout />
                    </PrivateRoute>
                  }
                >
                  {/* Painel - Página Principal */}
                  <Route index element={<Dashboard />} />
                  <Route path="adicionar" element={<AddTransaction />} />
                  <Route path="details" element={<Details />} />
                  <Route path="about" element={<ContactCard />} />
                  <Route path="settings" element={<Settings />} />
                  {/* Redirecionamento se a rota não existir */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Route>

                <Route path="login" element={<Login />} />
                <Route path="cadastro" element={<Signup />} />
              </Routes>
              {/* Chatbot - Disponível em todas as páginas */}
              {isChatOpen && <ChatWidget />}
              <ChatbotButton
                isOpen={isChatOpen}
                onClick={() => setIsChatOpen(!isChatOpen)}
              />
            </Router>
          </AuthProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
