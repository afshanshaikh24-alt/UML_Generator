import { DiagramModel } from '../models';
import { validateDiagramJson } from './validation';
import { generateId } from './helpers';

export function exportDiagramToJson(diagram: DiagramModel): string {
  return JSON.stringify(diagram, null, 2);
}

export function downloadJson(diagram: DiagramModel): void {
  const json = exportDiagramToJson(diagram);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${diagram.name.replace(/\s+/g, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDiagramFromJson(jsonString: string): { diagram: DiagramModel | null; errors: string[] } {
  try {
    const parsed = JSON.parse(jsonString);
    const { valid, errors } = validateDiagramJson(parsed);
    if (!valid) return { diagram: null, errors };
    // Ensure ID exists
    if (!parsed.id) parsed.id = generateId();
    if (!parsed.version) parsed.version = '1.0';
    if (!parsed.createdAt) parsed.createdAt = new Date().toISOString();
    parsed.updatedAt = new Date().toISOString();
    // Ensure all classes have positions
    if (Array.isArray(parsed.classes)) {
      parsed.classes = parsed.classes.map((c: DiagramModel['classes'][0], i: number) => ({
        ...c,
        position: c.position ?? { x: 100 + (i % 4) * 220, y: 100 + Math.floor(i / 4) * 250 },
      }));
    }
    return { diagram: parsed as DiagramModel, errors: [] };
  } catch (e) {
    return { diagram: null, errors: ['Invalid JSON: ' + (e instanceof Error ? e.message : 'Unknown error')] };
  }
}

export async function downloadJavaZip(files: Map<string, string>, zipName: string): Promise<void> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  files.forEach((code, filename) => {
    zip.file(filename, code);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${zipName.replace(/\s+/g, '_')}_java.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadSingleJava(code: string, filename: string): void {
  const blob = new Blob([code], { type: 'text/x-java' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
