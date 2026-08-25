const ZONES = [
  { label: "Голова", note: "мягко" },
  { label: "Плечи", note: "мягко" },
  { label: "Поясница", note: "усилено" },
  { label: "Таз", note: "усилено" },
  { label: "Бёдра", note: "средне" },
  { label: "Голени", note: "средне" },
  { label: "Стопы", note: "мягко" },
];

export default function SpringZonesDiagram() {
  const zoneWidth = 560 / ZONES.length;
  return (
    <div className="layer-diagram-box">
      <div className="layer-diagram-cap">
        <span>независимый пружинный блок · 7 анатомических зон</span>
        <span className="val">FIG.02</span>
      </div>
      <svg
        viewBox="0 0 560 220"
        width="100%"
        role="img"
        aria-label="Схема семи анатомических зон независимого пружинного блока независимый пружинный блок"
      >
        <rect x={10} y={20} width={540} height={140} rx={10} fill="#FBFAF7" stroke="#E6E9EC" />
        {ZONES.map((zone, i) => {
          const x = 10 + i * zoneWidth;
          return (
            <g key={zone.label}>
              {i > 0 && (
                <line x1={x} y1={20} x2={x} y2={160} stroke="#E6E9EC" />
              )}
              <g fill="#8F7350" opacity={0.75}>
                {[0, 1, 2].map((row) => (
                  <circle
                    key={row}
                    cx={x + zoneWidth / 2}
                    cy={50 + row * 40}
                    r={i === 2 || i === 3 ? 3.2 : 4.4}
                  />
                ))}
              </g>
              <text
                x={x + zoneWidth / 2}
                y={188}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill="#5B616B"
              >
                {zone.label}
              </text>
              <text
                x={x + zoneWidth / 2}
                y={204}
                textAnchor="middle"
                fontSize={9.5}
                fill="#B99B72"
              >
                {zone.note}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
