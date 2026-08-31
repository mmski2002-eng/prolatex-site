interface ParsedLayer {
  raw: string;
  title: string;
  detail: string;
  weight: number;
}

const SAND = ["#F7F2EA", "#EFE3CF", "#E4D2B4", "#F2E9DA", "#EAD9BE"];
const SPRING_FILL = "#DCEBE2";
const SAND_STROKE = "#b99b72";
const SPRING_STROKE = "#2e6b4e";

function parseLayer(raw: string, index: number): ParsedLayer {
  const cmMatch = raw.match(/(\d+)\s*см/);
  const weight = cmMatch ? Number(cmMatch[1]) : 3;
  const dashIndex = raw.indexOf("—");
  let title = raw;
  let detail = "";
  if (dashIndex !== -1) {
    title = raw.slice(0, dashIndex).trim();
    detail = raw.slice(dashIndex + 1).trim();
  } else if (raw.includes(",")) {
    const [first, ...rest] = raw.split(",");
    title = first.trim();
    detail = rest.join(",").trim();
  }
  return { raw, title, detail, weight: Math.max(weight, 2.2) + index * 0.001 };
}

export default function LayerDiagram({
  layers,
  totalHeightCm,
}: {
  layers: string[];
  totalHeightCm: number;
}) {
  const parsed = layers.map(parseLayer);
  const totalWeight = parsed.reduce((s, l) => s + l.weight, 0);
  const boxHeight = 300;
  const boxWidth = 260;

  const heights = parsed.map((layer) => (layer.weight / totalWeight) * boxHeight);
  const offsets = heights.reduce<number[]>((acc, h, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + heights[i - 1]);
    return acc;
  }, []);

  let sandIdx = 0;
  const rects = parsed.map((layer, i) => {
    const h = heights[i];
    const y = offsets[i];
    const spring = /пружин/i.test(layer.raw);
    const fill = spring ? SPRING_FILL : SAND[sandIdx++ % SAND.length];
    return (
      <g key={i}>
        <rect
          x={20}
          y={y}
          width={boxWidth}
          height={Math.max(h - 2, 6)}
          fill={fill}
          stroke={spring ? SPRING_STROKE : SAND_STROKE}
        />
        <line
          x1={20 + boxWidth}
          y1={y + h / 2}
          x2={20 + boxWidth + 30}
          y2={y + h / 2}
          stroke="#16181D"
          strokeWidth={1}
        />
        <text
          x={20 + boxWidth + 36}
          y={y + h / 2 + 4}
          fontSize={12}
          fontWeight={700}
          fill="#16181D"
        >
          {String(i + 1).padStart(2, "0")}
        </text>
      </g>
    );
  });

  return (
    <div className="layer-diagram-box">
      <div className="layer-diagram-cap">
        <span>Разрез / высота {totalHeightCm} см</span>
        <span className="val">FIG.01</span>
      </div>
      <svg
        viewBox={`0 0 ${20 + boxWidth + 70} ${boxHeight + 10}`}
        width="100%"
        role="img"
        aria-label={`Схема слоёв матраса, ${layers.length} слоёв, общая высота ${totalHeightCm} см`}
      >
        <rect
          x={20}
          y={0}
          width={boxWidth}
          height={boxHeight}
          fill="none"
          stroke="#16181D"
          strokeWidth={1}
        />
        {rects}
      </svg>
    </div>
  );
}

/** Описание функции слоя, если в данных нет своих характеристик. */
function fallbackDetail(l: ParsedLayer): string {
  if (l.detail) return l.detail;
  const raw = l.raw.toLowerCase();
  if (raw.includes("чехол")) return "Снимается по молнии для стирки и чистки";
  if (raw.includes("термовойлок"))
    return "Плотный защитный слой между латексом и пружинным блоком";
  if (raw.includes("топпер"))
    return "Мягкий верхний слой — «перина» для отельного ощущения";
  if (raw.includes("латекс")) return "Комфортный слой натурального латекса";
  return "";
}

export function LayerList({
  layers,
  hideSizes = false,
}: {
  layers: string[];
  /** Скрыть подпись, если она состоит только из толщины слоя («2 см»). */
  hideSizes?: boolean;
}) {
  const parsed = layers.map(parseLayer);
  const isSpring = (l: ParsedLayer) => /пружин/i.test(l.raw);
  const detailOf = (l: ParsedLayer) => {
    const detail = fallbackDetail(l);
    return hideSizes && /^\d+([.,]\d+)?\s*см$/i.test(detail) ? "" : detail;
  };
  return (
    <div className="layer-stack" role="list" aria-label="Слои матраса сверху вниз">
      {parsed.map((layer, i) => (
        <div
          role="listitem"
          className={`layer-band${isSpring(layer) ? " spring" : ""}`}
          style={{ flexGrow: layer.weight }}
          key={i}
        >
          <div className="layer-band-text">
            <h4>{layer.title}</h4>
            {detailOf(layer) && <p>{detailOf(layer)}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
