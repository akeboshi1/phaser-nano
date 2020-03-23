import { ITextureComponent, IRenderableComponent } from '../components';
import WebGLRenderer from '../renderer/WebGLRenderer';
import MultiTextureQuadShader from '../renderer/MultiTextureQuadShader';

export default interface IRenderable extends
    ITextureComponent,
    IRenderableComponent
    {
        renderWebGL (renderer: WebGLRenderer, shader: MultiTextureQuadShader, startActiveTexture: number): void;
    }
