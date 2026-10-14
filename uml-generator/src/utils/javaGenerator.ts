import { ClassModel, DiagramModel, Attribute, Method, Parameter, Visibility } from '../models';

function visibilityModifier(v: Visibility): string {
  const map: Record<Visibility, string> = {
    public: 'public',
    private: 'private',
    protected: 'protected',
    package: '',
  };
  return map[v];
}

function generateAttribute(attr: Attribute, indent: string): string {
  const parts: string[] = [];
  const vis = visibilityModifier(attr.visibility);
  if (vis) parts.push(vis);
  if (attr.isStatic) parts.push('static');
  if (attr.isFinal) parts.push('final');
  parts.push(attr.type);
  let line = `${indent}${parts.join(' ')} ${attr.name}`;
  if (attr.defaultValue) {
    if (attr.type === 'String') {
      line += ` = "${attr.defaultValue}"`;
    } else {
      line += ` = ${attr.defaultValue}`;
    }
  }
  line += ';';
  return line;
}

function generateParameters(params: Parameter[]): string {
  return params.map((p) => `${p.type} ${p.name}`).join(', ');
}

function generateMethod(
  method: Method,
  cls: ClassModel,
  indent: string
): string {
  const lines: string[] = [];
  const parts: string[] = [];
  const vis = visibilityModifier(method.visibility);
  if (vis) parts.push(vis);
  if (method.isStatic) parts.push('static');
  if (method.isFinal) parts.push('final');
  if (method.isAbstract && !cls.isInterface) parts.push('abstract');
  parts.push(method.returnType);

  const params = generateParameters(method.parameters);
  const signature = `${indent}${parts.join(' ')} ${method.name}(${params})`;

  if (method.isAbstract || cls.isInterface) {
    lines.push(`${signature};`);
  } else {
    lines.push(`${signature} {`);
    if (method.returnType !== 'void') {
      const defaultReturn = getDefaultReturn(method.returnType);
      lines.push(`${indent}    return ${defaultReturn};`);
    }
    lines.push(`${indent}}`);
  }
  return lines.join('\n');
}

function getDefaultReturn(type: string): string {
  const defaults: Record<string, string> = {
    int: '0',
    long: '0L',
    double: '0.0',
    float: '0.0f',
    boolean: 'false',
    char: "'\\0'",
    byte: '0',
    short: '0',
    String: 'null',
  };
  return defaults[type] ?? 'null';
}

function generateGettersSetters(attributes: Attribute[], indent: string): string[] {
  const lines: string[] = [];
  for (const attr of attributes) {
    if (attr.visibility !== 'private' && attr.visibility !== 'protected') continue;
    // Getter
    const capitalName = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
    const getterPrefix = attr.type === 'boolean' ? 'is' : 'get';
    lines.push('');
    lines.push(`${indent}public ${attr.type} ${getterPrefix}${capitalName}() {`);
    lines.push(`${indent}    return ${attr.name};`);
    lines.push(`${indent}}`);
    // Setter (skip final)
    if (!attr.isFinal && !attr.isStatic) {
      lines.push('');
      lines.push(`${indent}public void set${capitalName}(${attr.type} ${attr.name}) {`);
      lines.push(`${indent}    this.${attr.name} = ${attr.name};`);
      lines.push(`${indent}}`);
    }
  }
  return lines;
}

export function generateJavaClass(cls: ClassModel, generateGettersSettersFlag = true): string {
  const lines: string[] = [];
  const indent = '    ';

  // Package declaration
  if (cls.packageName) {
    lines.push(`package ${cls.packageName};`);
    lines.push('');
  }

  // Class declaration
  const classParts: string[] = [];
  const hasPrivateAttrs = cls.attributes.some(
    (a) => a.visibility === 'private' || a.visibility === 'protected'
  );

  if (cls.isInterface) {
    classParts.push('public interface');
  } else {
    classParts.push('public');
    if (cls.isAbstract) classParts.push('abstract');
    if (cls.isFinal) classParts.push('final');
    classParts.push('class');
  }

  classParts.push(cls.name);

  if (!cls.isInterface && cls.extendsClass) {
    classParts.push(`extends ${cls.extendsClass}`);
  }

  if (cls.implementsInterfaces && cls.implementsInterfaces.length > 0) {
    const keyword = cls.isInterface ? 'extends' : 'implements';
    classParts.push(`${keyword} ${cls.implementsInterfaces.join(', ')}`);
  }

  lines.push(`${classParts.join(' ')} {`);
  lines.push('');

  // Attributes
  for (const attr of cls.attributes) {
    lines.push(generateAttribute(attr, indent));
  }

  if (cls.attributes.length > 0) {
    lines.push('');
  }

  // Constructor (skip for interfaces)
  if (!cls.isInterface && cls.attributes.length > 0) {
    lines.push(`${indent}public ${cls.name}() {`);
    lines.push(`${indent}}`);
    lines.push('');

    // Parameterized constructor
    const nonStaticAttrs = cls.attributes.filter((a) => !a.isStatic);
    if (nonStaticAttrs.length > 0) {
      const paramStr = nonStaticAttrs.map((a) => `${a.type} ${a.name}`).join(', ');
      lines.push(`${indent}public ${cls.name}(${paramStr}) {`);
      for (const attr of nonStaticAttrs) {
        lines.push(`${indent}    this.${attr.name} = ${attr.name};`);
      }
      lines.push(`${indent}}`);
      lines.push('');
    }
  }

  // Methods
  for (const method of cls.methods) {
    lines.push(generateMethod(method, cls, indent));
    lines.push('');
  }

  // Getters/Setters
  if (generateGettersSettersFlag && !cls.isInterface && hasPrivateAttrs) {
    const gsLines = generateGettersSetters(cls.attributes, indent);
    if (gsLines.length > 0) {
      lines.push(...gsLines);
      lines.push('');
    }
  }

  lines.push('}');
  return lines.join('\n');
}

export function generateAllJava(diagram: DiagramModel): Map<string, string> {
  const result = new Map<string, string>();
  for (const cls of diagram.classes) {
    const code = generateJavaClass(cls);
    result.set(`${cls.name}.java`, code);
  }
  return result;
}
