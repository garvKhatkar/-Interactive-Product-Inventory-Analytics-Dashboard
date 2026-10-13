import { useCallback, useMemo, useRef, useState } from "react";

// Types
type Product = {
  name: string;
  price: number;
  category?: string;
};

export default function App() {
  const [budgetMax, setBudgetMax] = useState<number>(100);
  const [premiumMin, setPremiumMin] = useState<number>(500);
  const [affordableUnder, setAffordableUnder] = useState<number>(200);

  const [inventory, setInventory] = useState<Product[]>([
    { name: "Laptop", price: 800 },
    { name: "Mouse", price: 25 },
  ]);

  const [logs, setLogs] = useState<string[]>([]);
  const consoleRef = useRef<HTMLDivElement | null>(null);

  const safeLog = useCallback((msg: string) => {
    // Update on-screen console and real console
    setLogs((prev) => [...prev, msg]);
    // eslint-disable-next-line no-console
    console.log(msg);
  }, []);

  const scrollConsoleToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      }
    });
  }, []);

  const categorize = useCallback(
    (price: number): string => {
      // Validate thresholds using control flow
      let low = budgetMax;
      let high = premiumMin;
      if (low >= high) {
        // Fix invalid thresholds by auto-adjusting
        high = low + 1;
      }

      // Use switch(true) to evaluate ranges
      switch (true) {
        case price >= high:
          return "Premium";
        case price <= low:
          return "Budget";
        default:
          return "Standard";
      }
    },
    [budgetMax, premiumMin]
  );

  // Regular function for total, arrow with closure for price adjustments
  function computeTotal(items: Product[]): number {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      // demonstrate continue/break in a loop
      const p = items[i];
      if (typeof p.price !== "number" || Number.isNaN(p.price)) {
        continue; // skip bad entries gracefully
      }
      if (p.price < 0) {
        break; // stop if sentinel/invalid negative price encountered
      }
      total += p.price;
    }
    return total;
  }

  const makePriceAdjuster = (taxRate: number, discount: number) => {
    const rate = Math.max(0, taxRate);
    const disc = Math.max(0, discount);
    return (price: number) => price * (1 + rate) - disc;
  };

  const adjustedTotal = useMemo(() => {
    const adjust = makePriceAdjuster(0.0, 0.0); // not altering totals, just demonstrating scoped closure
    return inventory.reduce((sum, item) => sum + adjust(item.price), 0);
  }, [inventory]);

  const runSimulation = useCallback(() => {
    const working = [...inventory];

    safeLog("--- Initializing Inventory System ---");

    // Prompt-based data input with explicit conversions
    let attempts = 0;
    let newName: string | null = null;
    let newPrice: number | null = null;

    while (attempts < 3) {
      const nameInput = window.prompt("Enter a new product name (e.g., Monitor):", attempts === 0 ? "Monitor" : "");
      if (!nameInput || !nameInput.trim()) {
        safeLog("[Warning] Invalid product name. Please try again.");
        attempts++;
        continue; // try again
      }
      newName = nameInput.trim();

      const priceInput = window.prompt("Enter the product price in USD (e.g., 150):", attempts === 0 ? "150" : "");
      const parsed = Number(priceInput);
      if (!priceInput || Number.isNaN(parsed) || parsed < 0) {
        safeLog("[Warning] Invalid price value. Please try again.");
        attempts++;
        continue; // try again
      }
      newPrice = parsed;
      break; // success
    }

    // Default values if user cancels/invalid after attempts
    if (newName == null || newPrice == null) {
      newName = "Monitor";
      newPrice = 150;
      safeLog('[Prompt executed: User adds "Monitor" at "$150"]');
    } else {
      safeLog(`[Prompt executed: User adds "${newName}" at "$${newPrice}"]`);
    }

    // Duplicate check using a classic loop with break
    let isDuplicate = false;
    for (let i = 0; i < working.length; i++) {
      if (working[i].name.toLowerCase() === (newName as string).toLowerCase()) {
        isDuplicate = true;
        safeLog(`[Info] Duplicate detected for item name: ${newName}. Item will be updated.`);
        // Update existing item and break
        working[i].price = newPrice as number;
        break;
      }
    }

    if (!isDuplicate) {
      working.push({ name: newName as string, price: newPrice as number });
    }

    // Apply categories to all items
    const withCategories = working.map((item) => ({ ...item, category: categorize(item.price) }));

    safeLog("");
    safeLog("--- Processing Inventory Roster (forEach) ---");
    withCategories.forEach((i) => {
      safeLog(`* Item: ${i.name} ($${i.price}) -> Category: ${i.category}`);
    });

    // Financial analytics using functions and array methods
    const totalValue = computeTotal(withCategories);
    const affordable = withCategories.filter((i) => i.price < affordableUnder).map((i) => i.name);
    const formatted = withCategories.map((i) => `${i.name.toUpperCase()}: $${i.price}`);

    safeLog("");
    safeLog("--- Financial Analytics ---");
    safeLog(`Total Inventory Value: $${totalValue}`);
    safeLog(`Filtered Affordable Items (Under $${affordableUnder}): ${JSON.stringify(affordable)}`);
    safeLog(`Formatted Report List: ${JSON.stringify(formatted)}`);

    setInventory(withCategories);
    scrollConsoleToBottom();
  }, [inventory, safeLog, categorize, affordableUnder, scrollConsoleToBottom]);

  const resetLogs = useCallback(() => setLogs([]), []);

  const resetInventory = useCallback(() => {
    setInventory([
      { name: "Laptop", price: 800 },
      { name: "Mouse", price: 25 },
    ]);
    safeLog("[Reset] Inventory restored to initial items.");
  }, [safeLog]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-100 text-slate-800">
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Interactive Product Inventory & Analytics Dashboard</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              A console-simulated capstone mini project that demonstrates input prompts, control flow, loops, functions, and array
              methods (forEach, filter, map) — built with React + Vite + Tailwind CSS.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetLogs}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Clear Console
            </button>
            <button
              onClick={resetInventory}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Reset Inventory
            </button>
            <button
              onClick={runSimulation}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Run Simulation
            </button>
          </div>
        </header>

        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Dynamic Category Thresholds</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-slate-600">Budget max price</span>
              <input
                type="number"
                min={0}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-inner focus:border-indigo-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-slate-600">Premium min price</span>
              <input
                type="number"
                min={0}
                value={premiumMin}
                onChange={(e) => setPremiumMin(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-inner focus:border-indigo-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-slate-600">Affordable filter under ($)</span>
              <input
                type="number"
                min={0}
                value={affordableUnder}
                onChange={(e) => setAffordableUnder(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-inner focus:border-indigo-500 focus:outline-none"
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Categories are assigned with switch(true): price ≥ Premium is Premium, price ≤ Budget is Budget, otherwise Standard.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Console Output</h2>
            <div
              ref={consoleRef}
              className="h-80 w-full overflow-auto rounded-md bg-slate-950 p-3 font-mono text-sm text-slate-100"
            >
              {logs.length === 0 ? (
                <p className="text-slate-400">Press "Run Simulation" to start. Output will appear here and in the browser console.</p>
              ) : (
                logs.map((l, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">
                    {l}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Inventory Snapshot</h2>
            <div className="overflow-hidden rounded-md border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium text-slate-600">Item</th>
                    <th className="px-3 py-2 font-medium text-slate-600">Price ($)</th>
                    <th className="px-3 py-2 font-medium text-slate-600">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item, idx) => (
                    <tr key={`${item.name}-${idx}`}>
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.price}</td>
                      <td className="px-3 py-2">
                        <span
                          className={
                            item.category === "Premium"
                              ? "inline-flex rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-medium text-fuchsia-700"
                              : item.category === "Budget"
                              ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                              : "inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700"
                          }
                        >
                          {item.category ?? "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-medium">
                    <td className="px-3 py-2">Total</td>
                    <td className="px-3 py-2">${adjustedTotal}</td>
                    <td className="px-3 py-2 text-slate-500">(sum via function)</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">Totals use a regular function and a closure-based arrow for demonstration.</p>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">How to run this project</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
            <li>Ensure Node.js 18+ and npm are installed.</li>
            <li>Install dependencies: <code className="rounded bg-slate-100 px-1 py-0.5">npm install</code></li>
            <li>Start the dev server: <code className="rounded bg-slate-100 px-1 py-0.5">npm run dev</code> (open the shown local URL).</li>
            <li>Build for production: <code className="rounded bg-slate-100 px-1 py-0.5">npm run build</code></li>
            <li>Preview the build locally: <code className="rounded bg-slate-100 px-1 py-0.5">npm run preview</code></li>
          </ol>
          <p className="mt-2 text-xs text-slate-500">This project runs on any platform that supports Node.js (Windows, macOS, Linux). Deployed builds can be hosted on static site platforms like Vercel, Netlify, or GitHub Pages.</p>
        </section>
      </div>
    </div>
  );
}
