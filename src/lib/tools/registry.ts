/** Every calculator of src/lib/tools/ (files starting with "_" and the type files are skipped). */
import type { ToolFactory, ToolSpec } from './types';
const mods = import.meta.glob<{ default: ToolFactory }>(['./*.ts', '!./_*.ts', '!./types.ts', '!./registry.ts'], { eager: true });
export const TOOLS: Record<string, ToolFactory> = Object.fromEntries(Object.entries(mods).map(([f, m]) => [f.split('/').pop()!.replace(/\.ts$/, ''), m.default]));
export function getTool(kind: string, arg?: string): ToolSpec {
  const f = TOOLS[kind];
  if (!f) throw new Error(`Unknown calculator: ${kind} (create src/lib/tools/${kind}.ts)`);
  return f(arg);
}
