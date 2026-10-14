export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export const JAVA_KEYWORDS = new Set([
  'abstract','assert','boolean','break','byte','case','catch','char','class',
  'const','continue','default','do','double','else','enum','extends','final',
  'finally','float','for','goto','if','implements','import','instanceof','int',
  'interface','long','native','new','package','private','protected','public',
  'return','short','static','strictfp','super','switch','synchronized','this',
  'throw','throws','transient','try','void','volatile','while',
]);

export const COMMON_TYPES = [
  'int','long','double','float','boolean','char','byte','short',
  'String','Integer','Long','Double','Float','Boolean','Character','Byte','Short',
  'Object','void','List','ArrayList','Map','HashMap','Set','HashSet',
  'Date','LocalDate','LocalDateTime','BigDecimal','Optional',
];

export const VISIBILITY_SYMBOLS: Record<string, string> = {
  public: '+',
  private: '-',
  protected: '#',
  package: '~',
};
