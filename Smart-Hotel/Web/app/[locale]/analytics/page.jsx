export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Analytics</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center" style={{ minHeight: "500px" }}>
        <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <h2 className="text-base font-semibold text-gray-700 mb-2">Analytics à venir</h2>
        <p className="text-sm text-gray-400 text-center max-w-xs">
          Les graphiques et statistiques seront disponibles prochainement.
        </p>
      </div>
    </div>
  );
}