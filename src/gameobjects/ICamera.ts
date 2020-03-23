import IGameObject from './IGameObject';
import WebGLRenderer from '../renderer/WebGLRenderer';

export default interface ICamera extends IGameObject
    {
        matrix: Float32Array;
        renderer: WebGLRenderer;
    }
