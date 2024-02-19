import { JSONSchemaFaker } from 'json-schema-faker';

import formats from './formats';
import { schemaFakerParams } from './types';

const DEFAULT_SCHEMA_FAKER_PARAMS = {
  optionalsProbability: 0.5,
  failOnInvalidTypes: true
}

export type Callback = (value: any) => void;

export default function buildSchemaFaker(params: schemaFakerParams = {}) {
  const schemaFakerOptions = {
    ...DEFAULT_SCHEMA_FAKER_PARAMS,
    params
  };

  JSONSchemaFaker.option(schemaFakerOptions);

  Object.values(formats)
    .forEach((format) => {
      const NAME: string = formats.name;
      const generate: Callback = formats.generate;

      JSONSchemaFaker.format(NAME, generate);
    });

  return JSONSchemaFaker;
}
