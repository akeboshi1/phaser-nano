import * as Components from '../components';

export default interface ISprite extends
    Components.IContainerComponent,
    Components.IDirtyComponent,
    Components.IInputComponent,
    Components.IOriginComponent,
    Components.IParentComponent,
    Components.IPositionComponent,
    Components.IQuadAlphaComponent,
    Components.IQuadTintComponent,
    Components.IRenderableComponent,
    Components.IRotationComponent,
    Components.IScaleComponent,
    Components.ISceneComponent,
    Components.ISizeComponent,
    Components.ISkewComponent,
    Components.ITextureComponent,
    Components.ITransformComponent,
    Components.IVisibleComponent
    {
        vertexData: Float32Array;
        vertexColor: Uint32Array;
        packColors (): this;
        updateVertices (F32: Float32Array, U32: Uint32Array, offset: number): void;
    }
