import { ESTree } from 'meriyah';
import { JSXContext } from './context';
import { evalExpression, evalFunctionExpression } from './expression';
import { AnyFunction } from './options';

export interface MethodDefinition {
  type: 'Method';
  kind: ESTree.MethodDefinition['kind'];
  key: string;
  value: AnyFunction;
  static: boolean;
}

export interface PropertyDefinition {
  type: 'Property';
  kind: 'property';
  key: string;
  value: AnyFunction;
  static: boolean;
}

export type Definition = MethodDefinition | PropertyDefinition;

export const evalMethodDefinition = (exp: ESTree.MethodDefinition, context: JSXContext, binding: any): MethodDefinition | undefined => {
  if (!exp.key) return undefined;

  let key: string;
  switch (exp.key.type) {
    case 'Identifier':
      key = exp.key.name;
      break;
    case 'PrivateIdentifier':
      key = exp.key.name;
      break;
    default:
      key = evalExpression(exp.key, context, binding);
      break;
  }
  const value = evalFunctionExpression(exp.value, context, binding);

  return {
    type: 'Method',
    kind: exp.kind,
    static: exp.static,
    key,
    value,
  };
};

export const evalPropertyDefinition = (exp: ESTree.PropertyDefinition, context: JSXContext, binding: any): PropertyDefinition => {
  let key: string;
  switch (exp.key.type) {
    case 'Identifier':
      key = exp.key.name;
      break;
    case 'PrivateIdentifier':
      key = exp.key.name;
      break;
    default:
      key = evalExpression(exp.key, context, binding);
      break;
  }
  const value = evalExpression(exp.value, context, binding);

  return {
    type: 'Property',
    kind: 'property',
    static: exp.static,
    key,
    value,
  };
};
