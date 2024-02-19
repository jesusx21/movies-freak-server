import { isArray, isPlainObject, isString } from 'lodash';

import formats from './formats';
import { getReplacerSpec } from './formats/replaceKeyword';
import { Json } from '../../../types/common';

const REPLACER_KEYWORD = '__$replace:';

const defaultReplacer = { replace: () => console.log('Replacer not valid') };

export default function replaceFormats(input: any): any {
  if (isArray(input)) {
    return input.map(replaceFormats);
  }

  if (isPlainObject(input)) {
    return Object.keys(input)
      .reduce((response: Json, key: string) => {
        return {
          ...response,
          [key]: replaceFormats(input[key])
        };
      }, {});
  }

  if (isString(input)) {
    if (input.indexOf(REPLACER_KEYWORD) === -1) {
      return input;
    }

    const { name, value } = getReplacerSpec(input);
    const fieldReplacer = formats[name] || defaultReplacer;

    return fieldReplacer.replacer(value);
  }

  return input;
}
