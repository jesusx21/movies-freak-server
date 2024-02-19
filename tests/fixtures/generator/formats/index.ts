
import { Json } from '../../../../types/common';

import {
  NAME,
  replace,
  generate
} from './date';

const formats: Json = {
  [NAME]: {
    generate,
    NAME,
    replace
  }
};

export default formats;
