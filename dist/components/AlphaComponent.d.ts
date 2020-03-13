import { IDirtyComponent } from './DirtyComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Dirtyable = Constructor<IDirtyComponent>;
export declare function AlphaComponent<TBase extends Dirtyable>(Base: TBase): new () => Object;
export interface IAlphaComponent {
    alpha: number;
    setAlpha(value?: number): this;
}
export {};
//# sourceMappingURL=AlphaComponent.d.ts.map