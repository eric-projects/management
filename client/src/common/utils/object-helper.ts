export function ObjectAssign(source: any, target: any) {
  const sourceKeys = Object.keys(source);
  sourceKeys.forEach(key => {
    if (typeof source[key] === 'object') {
      if (Array.isArray(source[key])) {
      } else {
      }
    } else {
      source[key] = target[key];
    }
  });

  Object.keys(target)
    .filter(key => !sourceKeys.includes(key))
    .forEach(key => {
      source[key] = target[key];
    });
}
