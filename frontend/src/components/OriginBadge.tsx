import Image from "next/image";

export default function OriginBadge() {
  return (
    <div className="origin-badge">
      <div className="origin-badge-flags">
        <Image src="/img/flags/be.svg" alt="Флаг Бельгии" width={54} height={36} />
        <Image src="/img/flags/eu.svg" alt="Флаг Европейского союза" width={54} height={36} />
      </div>
      <span>Made in Belgium</span>
    </div>
  );
}
