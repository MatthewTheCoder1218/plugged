function Sidebar({ setPage }) {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 font-bold text-lg">Plugged Menu</div>
      <nav className="flex-1 p-2">
        <button
          onClick={() => setPage("dashboard")}
          className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
        >
          Dashboard
        </button>
        <button
          onClick={() => setPage("backend")}
          className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
        >
          Generate Backend
        </button>
        <button
          onClick={() => setPage("baas")}
          className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded"
        >
          Connect BaaS
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
