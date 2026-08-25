export default function SizeTable({
  widths,
  lengths,
}: {
  widths: number[];
  lengths: number[];
}) {
  return (
    <div className="size-table-wrap">
      <table className="size-table">
        <caption className="visually-hidden">
          Таблица доступных размеров матраса: ширины по строкам, длины по
          столбцам
        </caption>
        <thead>
          <tr>
            <th scope="col">Ширина \ Длина</th>
            {lengths.map((l) => (
              <th scope="col" key={l}>
                {l} см
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {widths.map((w) => (
            <tr key={w}>
              <th scope="row">{w} см</th>
              {lengths.map((l) => (
                <td key={l}>
                  {w}×{l}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
