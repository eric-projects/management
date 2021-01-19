export type styleCase = 'pascal' | 'camel' | 'kebab' | 'snake' | 'bigCamel' | 'bigKebab' | 'bigSnake';

/**
 * e.g.: userName -> user-name
 */
export function camelToKebab(name: string): string {
  return name.replace(/[A-Z]/g, w => '-' + w.toLowerCase());
}

/**
 * 修改变量的命名风格，变量只能使用 字母、横杠、下划线 命名
 * 支持的风格如下：
 * pascal: e.g. UserName
 * camel:  e.g. userName
 * kebab:  e.g. user-name
 * snake:  e.g. user_name
 */
export function toCasedStyle(variable: string, style: styleCase): string {
  // 移除非支持风格字符
  variable = variable.replace(/[^a-zA-Z_-]+/, '');
  if (!variable) {
    return '';
  }
  // 分割变量
  const arr = variable.split(/((?=[A-Z])|-|_)/g).filter(v => !['', '-', '_'].includes(v));
  if (arr.length < 1) {
    return '';
  }

  switch (style) {
    case 'pascal':
    case 'bigCamel':
      return arr.map(v => v.replace(/^[a-zA-Z]/, w => w.toUpperCase())).join('');
    case 'camel':
      return arr.map((v, i) => v.replace(/^[a-zA-Z]/, w => (i === 0 ? w.toLowerCase() : w.toUpperCase()))).join('');
    case 'kebab':
      return arr.map(v => v.replace(/^[a-zA-Z]/, w => w.toLowerCase())).join('-');
    case 'bigKebab':
      return arr.map(v => v.replace(/^[a-zA-Z]/, w => w.toUpperCase())).join('-');
    case 'snake':
      return arr.map(v => v.replace(/^[a-zA-Z]/, w => w.toLowerCase())).join('_');
    case 'bigSnake':
      return arr.map(v => v.replace(/^[a-zA-Z]/, w => w.toUpperCase())).join('_');
    default:
      return variable;
  }
}

export function toCasedStyleObject(obj: any, style: styleCase = 'kebab'): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const newObj: { [key: string]: any } = {};

  removeNullValueProperty(obj);
  Object.keys(obj).forEach(key => {
    let value = obj[key];

    if (typeof value === 'string') {
      value = value.trim();
    } else if (value instanceof Date) {
      value = dateTransform(value);
    }
    newObj[toCasedStyle(key, style)] =
      typeof value === 'object' && Object.keys(value).length > 0 ? toCasedStyleObject(value, style) : value;
  });

  return newObj;
}

export function toQueryString(obj: any, style: styleCase = 'kebab'): string {
  let queryString = '';

  removeNullValueProperty(obj);
  Object.keys(obj).forEach(key => (queryString += `${toCasedStyle(key, style)}=${obj[key]}`));

  if (queryString) {
    queryString = '?' + queryString;
  }

  return queryString;
}

export function removeNullValueProperty(obj: any): any {
  Object.keys(obj).forEach(key => {
    if (!obj[key]) {
      delete obj[key];
    }
  });

  return obj;
}

export function dateTransform(date: Date): string {
  return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString();
}

export function replaceByValue(obj: any, sourceKey: string, targetKey: string) {
  if (!sourceKey || !targetKey || !obj || !obj[sourceKey] || !obj[sourceKey].value) {
    return undefined;
  }
  obj[targetKey] = obj[sourceKey] instanceof Array ? (obj[sourceKey] as any[]).map(it => it.value) : obj[sourceKey].value;
  delete obj[sourceKey];
}
