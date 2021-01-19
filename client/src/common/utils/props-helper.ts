const getComponentFromProp = (instance: any, prop: any, options = instance, execute = true) => {
  if (instance.$createElement) {
    const h = instance.$createElement;
    const temp = instance[prop];
    if (temp !== undefined) {
      return typeof temp === 'function' && execute ? temp(h, options) : temp;
    }
    return (
      instance.$slots[prop] ||
      (instance.$scopedSlots[prop] && execute && instance.$scopedSlots[prop](options)) ||
      instance.$scopedSlots[prop] ||
      undefined
    );
  } else {
    const h = instance.context.$createElement;
    const temp = getPropsData(instance)[prop];
    if (temp !== undefined) {
      return typeof temp === 'function' && execute ? temp(h, options) : temp;
    }
    const slotsProp: any = [];
    const componentOptions = instance.componentOptions || {};
    (componentOptions.children || []).forEach((child: any) => {
      if (child.data && child.data.slot === prop) {
        if (child.tag === 'template') {
          slotsProp.push(child.children);
        } else {
          slotsProp.push(child);
        }
      }
    });
    return slotsProp.length ? slotsProp : undefined;
  }
};

const getPropsData = (ele: any) => {
  let componentOptions = ele.componentOptions;
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions;
  }
  return componentOptions ? componentOptions.propsData || {} : {};
};

export { getPropsData, getComponentFromProp };
