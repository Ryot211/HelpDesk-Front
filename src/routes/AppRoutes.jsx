import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import TicketsPage from "../pages/TicketsPage";
import TicketCreatePage from "../pages/TicketCreatePage";
import TicketDetailPage from "../pages/TicketDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import CategoriasTicketPage from "../pages/CategoriasTicketPage";
import DepartamentosPage from "../pages/DepartamentosPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/nuevo" element={<TicketCreatePage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="categorias-ticket" element={<CategoriasTicketPage />} />
          <Route path="departamentos" element={<DepartamentosPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;