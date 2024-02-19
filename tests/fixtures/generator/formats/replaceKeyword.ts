const REPLACER_KEYWORD = '__$replace:';

type keyword = {
  name: string,
  value: any
};

export function replaceKeyword(name: string, value: any) {
  const spec = JSON.stringify({ name, value });

  return `${REPLACER_KEYWORD}${spec}`;
}

export function getReplacerSpec(spec: string): keyword {
  const objectEncoded = spec.replace(REPLACER_KEYWORD, '');

  return JSON.parse(objectEncoded);
}
