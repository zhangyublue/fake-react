export type Type = any;
export type Props = any;
export type Ref = any;
export type Key = any;
export type ElementType = any;

export  interface ReactElement {
  $$typeof: Symbol | number;
  type: ElementType;
  key: Key ;
  ref: Ref;
  props: Props;
  __mark: string;
}