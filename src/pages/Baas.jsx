function Baas() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Connect a BaaS</h2>
      <div className="space-x-3">
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded">
          Supabase
        </button>
        <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded">
          Firebase
        </button>
      </div>
    </div>
  );
}

export default Baas;
