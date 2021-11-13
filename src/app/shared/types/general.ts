import { FieldInfo } from 'mysql';

export type StringKeys<T> = Extract<keyof T, string>;

export interface QueryForm<T> {
  limit?: number;
  fields?: T;
}

export type Class = new (...args: any[]) => any;

export interface MysqlResult<T extends TableRow> {
  results?: T[];
  fields?: FieldInfo[];
}

export class TableRow {
  [key: string]: string | number;
}

export class ValueRow extends TableRow {
  v: string;
}

export interface MaxRow extends TableRow {
  max: number;
}

export interface MCore extends TableRow {
  core: string;
}

export interface VersionRow extends TableRow {
  database_version: string;
  database_structure: string;
  database_content: string;
}

export interface Flag {
  bit: number; // the position (index) of the bit
  name: string;
}

export interface Option {
  value: number | string;
  name: string;
  comment?: string;
}

export interface FieldDefinition {
  name: string;
  tooltip: string;
}
