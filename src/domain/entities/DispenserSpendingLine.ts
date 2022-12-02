export default interface DispenserSpendingLine {
  opened_at: string | null;
  closed_at: string | null;
  flow_volume: number;
  total_spent: number | null;
}
