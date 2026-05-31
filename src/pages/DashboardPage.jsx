function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-600">
          Resumen general del sistema HelpDesk.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Total tickets</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Registrados</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">En proceso</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Cerrados</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">0</h2>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;