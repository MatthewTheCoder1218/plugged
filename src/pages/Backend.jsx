function Backend() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Generate Backend</h2>
      <div className="space-x-3">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
          Express
        </button>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
          Fastify
        </button>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">
          NestJS
        </button>
      </div>
    </div>
  );
}

export default Backend;
