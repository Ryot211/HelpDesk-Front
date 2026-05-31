import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-slate-600">
          La página que buscas no existe.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;