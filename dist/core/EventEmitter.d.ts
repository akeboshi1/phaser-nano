export default class EventEmitter {
    private _events;
    constructor();
    on(event: string, callback: Function, context?: any, once?: boolean): this;
    once(event: string, callback: Function, context?: any): this;
    /**
     * Clear an event by name.
     */
    clearEvent(event: string): this;
    /**
     * Return an array listing the events for which the emitter has registered listeners.
     */
    eventNames(): string[];
    /**
     * Return the listeners registered for a given event.
     */
    listeners(event: string): Function[];
    /**
     * Return the number of listeners listening to a given event.
     */
    listenerCount(event: string): number;
    /**
     * Calls each of the listeners registered for a given event.
     */
    emit(event: string, ...args: any[]): boolean;
    /**
     * Remove the listeners of a given event.
     *
     * @param event
     * @param callback
     * @param context
     * @param once
     */
    off(event: string, callback?: Function, context?: any, once?: boolean): this;
    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param event
     */
    removeAllListeners(event?: string): void;
}
//# sourceMappingURL=EventEmitter.d.ts.map