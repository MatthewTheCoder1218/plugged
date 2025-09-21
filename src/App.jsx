import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
function App() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [processingDone, setProcessingDone] = useState(false);

  const toggleStack = (stack) => {
    if (stacks.includes(stack)) {
      setStacks(stacks.filter((s) => s !== stack));
    } else {
      setStacks([...stacks, stack]);
    }
  };

  // Listen to backend logs
  useEffect(() => {
    let unlisten;
    (async () => {
      unlisten = await listen("log", (event) => {
        setLogs((prev) => [...prev, event.payload]);
        if (event.payload.includes("All stacks processed")) {
          setProcessingDone(true);
        }
      });
    })();
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // Call backend when we hit Step 3
  useEffect(() => {
    if (step === 3 && file) {
      setLogs(["📂 Reading project files..."]);
      setProcessingDone(false);

      invoke("process_stacks", {
        stacks,
        folderPath: file.path, // ✅ real folder path
      }).catch((err) => {
        setLogs((prev) => [...prev, `❌ Error: ${err}`]);
      });
    }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex items-center justify-center overflow-x-auto">
      {/* Step 1: Pick Folder */}
      {step === 1 && (
        <div className="w-full max-w-xl text-center space-y-6">
          <h1 className="text-4xl font-bold">Plugged ⚡</h1>
          <p className="text-gray-400">Pick your project folder to get started</p>

          <button
            onClick={async () => {
              const folder = await open({
                directory: true,
                multiple: false,
              });
              if (folder) {
                setFile({ path: folder, name: folder.split(/[\\/]/).pop() });
              }
            }}
            className="block w-full bg-gray-900 border border-gray-700 rounded-xl p-10 cursor-pointer hover:border-blue-500 transition"
          >
            {file ? (
              <span className="block text-lg font-medium">{file.name}</span>
            ) : (
              <span className="block text-lg font-medium text-gray-400">
                📂 Click to select your project folder
              </span>
            )}
          </button>

          {file && (
            <button
              onClick={() => setStep(2)}
              className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
            >
              Next →
            </button>
          )}
        </div>
      )}

      {/* Step 2: Select Stack */}
      {step === 2 && (
        <div className="w-full max-w-4xl text-center space-y-8 bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-10 relative z-10">
          <h2 className="text-4xl font-bold">Choose Your Stack</h2>
          <p className="text-gray-400 text-lg">Select one or multiple</p>

          {/* Backend Frameworks */}
          <div className="text-left">
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">
              ⚙️ Backend Frameworks
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {["Express", "FastAPI", "Django"].map((stack) => (
                <button
                  key={stack}
                  onClick={() => toggleStack(stack)}
                  className={`p-6 rounded-xl border-2 text-lg font-semibold transition ${
                    stacks.includes(stack)
                      ? "border-blue-500 bg-blue-900/60 shadow-blue-500/40 shadow-md"
                      : "border-gray-700 hover:border-blue-500"
                  }`}
                >
                  {stack}
                </button>
              ))}
            </div>
          </div>

          {/* BaaS / Headless Services */}
          <div className="text-left mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-purple-400">
              ☁️ BaaS / Headless Services
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {["Supabase", "Firebase"].map((stack) => (
                <button
                  key={stack}
                  onClick={() => toggleStack(stack)}
                  className={`p-6 rounded-xl border-2 text-lg font-semibold transition ${
                    stacks.includes(stack)
                      ? "border-purple-500 bg-purple-900/50 shadow-purple-500/40 shadow-md"
                      : "border-gray-700 hover:border-purple-500"
                  }`}
                >
                  {stack}
                </button>
              ))}
            </div>
          </div>

          {/* Databases */}
          <div className="text-left mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-green-400">
              🗄️ Databases
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {["PostgreSQL", "MongoDB", "MySQL", "SQLite"].map((db) => (
                <button
                  key={db}
                  onClick={() => toggleStack(db)}
                  className={`p-6 rounded-xl border-2 text-lg font-semibold transition ${
                    stacks.includes(db)
                      ? "border-green-500 bg-green-900/50 shadow-green-500/40 shadow-md"
                      : "border-gray-700 hover:border-green-500"
                  }`}
                >
                  {db}
                </button>
              ))}
            </div>
          </div>

          {stacks.length > 0 && (
            <button
              onClick={() => setStep(3)}
              className="flex items-center justify-center gap-2 mt-10 bg-blue-600 px-8 py-4 rounded-xl text-xl font-semibold hover:bg-blue-700 hover:shadow-blue-500/40 transition"
            >
              Continue →
            </button>
          )}
        </div>
      )}


      {/* Step 3: Processing */}
      {step === 3 && (
        <div className="w-full max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Processing…</h2>
          <p className="text-gray-400">
            Generating backend + connecting{" "}
            <span className="text-blue-400 font-semibold">
              {stacks.join(", ")}
            </span>
          </p>

          {/* Console Output */}
          <div className="bg-black text-left p-4 rounded-lg font-mono text-sm h-40 overflow-y-auto border border-gray-700 mt-6">
            {logs.map((line, i) => (
              <p key={i} className="text-green-400">
                {line}
              </p>
            ))}
          </div>

          {processingDone && (
            <button
              onClick={() => setStep(4)}
              className="mt-6 bg-green-600 px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition"
            >
              Done →
            </button>
          )}
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="w-full max-w-xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Your Project is Ready 🎉</h2>
          <p className="text-gray-400">Connected with: {stacks.join(", ")}</p>

          <div className="flex flex-col gap-4 mt-6">
            <button
            onClick={async () => {
              try {
                const result = await invoke("open_folder", {
                  folderPath: file.path
                });
                console.log(result);
              } catch (error) {
                alert(`Error: ${error}`);
              }
            }}
             className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
              📂 Open Folder
            </button>
          </div>

          {/* Back button */}
          <button
            onClick={() => setStep(1)}
            className="mt-8 bg-gray-700 px-6 py-3 rounded-lg text-lg hover:bg-gray-600 transition"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
