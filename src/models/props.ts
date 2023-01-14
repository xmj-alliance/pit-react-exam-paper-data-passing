export interface IElementStyleStore {
  [k: string]: string,
}

export interface ICommonProps {
  data: unknown,
  events: {
    [k: string]: (...params: any[]) => unknown,
  },
  styles?: ILinkedStyles,
}

export interface ILinkedStyles {
  components?: {
    [k: string]: IElementStyleStore
  },
  children?: {
    [k: string]: ILinkedStyles
  }
}
