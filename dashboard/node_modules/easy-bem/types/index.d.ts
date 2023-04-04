interface Modifiers {
  [key: string]: unknown;
}

declare function Factory(): string;
declare function Factory(modifiers: Modifiers): string;
declare function Factory(element: string, modifiers?: Modifiers): string;

export default function bem(componentName: string): typeof Factory;
