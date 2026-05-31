function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Panel HelpDesk
          </h2>
          <p className="text-sm text-slate-500">
            Gestión de tickets de soporte técnico
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
          Usuario de prueba
        </div>
      </div>
    </header>
  );
}

export default Navbar;