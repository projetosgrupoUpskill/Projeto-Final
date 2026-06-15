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
import LandingPage from "./pages/LandingPage";


const queryClient = new QueryClient();

// Proteção para rotas que precisam de autenticação
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />; // ALTERADO: era "/landing" / "/login"
}

// ADICIONADO: decide o que mostrar em "/"
function HomeRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/painel" /> : <LandingPage />;
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
                <Route element={<MainLayout />}> {/* ALTERADO: removido path="/" e PrivateRoute aqui */}
                {/* ALTERADO: "/" agora decide entre LandingPage e redirect para /painel */}
                <Route path="/" element={<HomeRoute />} />

                {/* O MainLayout contém o Header, Navbar e Footer */}
                
                  <Route
                    path="painel" // ALTERADO: era "index" em "/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="adicionar"
                    element={
                      <PrivateRoute>
                        <AddTransaction />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="details"
                    element={
                      <PrivateRoute>
                        <Details />
                      </PrivateRoute>
                    }
                  />
                  {/* ALTERADO: "about" acessível com ou sem login */}
                  <Route path="about" element={<ContactCard />} />
                  <Route
                    path="settings"
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                </Route>

                <Route path="login" element={<Login />} />
                <Route path="cadastro" element={<Signup />} />

                {/* ALTERADO: redireciona para "/" em vez de "/landing" */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
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