import { formatDate } from "../../lib/format";

export function DataAsOfTag({ date }: { date: string }) {
  return <span className="fine-text">Data as of {formatDate(date)}</span>;
}
