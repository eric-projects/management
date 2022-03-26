declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.less' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.js' {
  const content: any;
  export default content;
}

declare module 'vue-virtual-scroller' {
  export const VirtualScroller: any;
}

declare module 'vue-infinite-scroll' {
  const content: any;
  export default content;
}

declare module 'vue-smooth-dnd' {
  const Container: any;
  const Draggable: any;
}

declare module 'jsonwebtoken';
