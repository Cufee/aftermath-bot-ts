export function realmFromPlayerId(id: number): string {
  switch (true) {
    case id == 0:
      return "";
    case id < 500000000:
      return "RU";
    case id < 1000000000:
      return "EU";
    case id < 2000000000:
      return "NA";
    default:
      return "AS";
  }
}
