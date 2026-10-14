export type Visibility = 'public' | 'private' | 'protected' | 'package';

export interface Parameter {
  id: string;
  name: string;
  type: string;
}

export interface Attribute {
  id: string;
  name: string;
  type: string;
  visibility: Visibility;
  isStatic: boolean;
  isFinal: boolean;
  defaultValue: string;
}

export interface Method {
  id: string;
  name: string;
  returnType: string;
  visibility: Visibility;
  isStatic: boolean;
  isAbstract: boolean;
  isFinal: boolean;
  parameters: Parameter[];
}

export interface ClassModel {
  id: string;
  name: string;
  packageName: string;
  isAbstract: boolean;
  isFinal: boolean;
  isInterface: boolean;
  extendsClass: string;
  implementsInterfaces: string[];
  attributes: Attribute[];
  methods: Method[];
  position: { x: number; y: number };
}

export type RelationshipType =
  | 'association'
  | 'directed-association'
  | 'inheritance'
  | 'aggregation'
  | 'composition'
  | 'dependency'
  | 'realization';

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  label: string;
  sourceMultiplicity: string;
  targetMultiplicity: string;
}

export interface DiagramModel {
  id: string;
  name: string;
  version: string;
  classes: ClassModel[];
  relationships: Relationship[];
  createdAt: string;
  updatedAt: string;
}
