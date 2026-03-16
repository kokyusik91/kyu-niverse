"use client";

interface DashboardStats {
  totalGames: number;
  totalPlayHours: number;
  mostPlayedName: string;
  mostPlayedHours: number;
  avgMetacritic: number;
}

export default function GameDashboard({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "TOTAL GAMES",
      main: String(stats.totalGames),
      bg: "bg-neo-primary",
      textColor: "text-white",
      labelColor: "text-white/80",
    },
    {
      label: "PLAY TIME",
      main: `${stats.totalPlayHours}h`,
      bg: "bg-neo-secondary",
      textColor: "text-white",
      labelColor: "text-white/80",
    },
    {
      label: "MOST PLAYED",
      main: stats.mostPlayedName,
      sub: `${stats.mostPlayedHours} hours`,
      bg: "bg-neo-accent",
      textColor: "text-neo-text",
      labelColor: "text-neo-text/60",
    },
    {
      label: "AVG SCORE",
      main: String(stats.avgMetacritic),
      bg: "bg-neo-surface",
      textColor: "text-neo-text",
      labelColor: "text-gray-500",
    },
  ];

  return (
    <div className="flex gap-4 p-5 border-b-3 border-neo-border">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex-1 ${card.bg} rounded-lg border-3 border-neo-border shadow-neo-md p-4`}
        >
          <p className={`font-neo-heading text-[11px] uppercase tracking-wider ${card.labelColor}`}>
            {card.label}
          </p>
          <p className={`font-space-grotesk text-4xl font-bold ${card.textColor} leading-tight`}>
            {card.main}
          </p>
          {card.sub && (
            <p className={`text-xs mt-0.5 ${card.labelColor}`}>{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
