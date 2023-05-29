export interface TestInstance {
  type: any;
  props: { [propName: string]: any };
  children?: Array<TestInstance | string>;
}
