export function ContainerComponent(Base) {
    return class ContainerComponent extends Base {
        constructor(...args) {
            super(args);
            this.children = [];
            this.isParent = true;
        }
        getChildren() {
            return this.children;
        }
        addChild(...child) {
            child.forEach((entity) => {
                this.addChildAt(entity, this.children.length);
            });
            return this;
        }
        addChildAt(child, index) {
            if (index >= 0 && index <= this.children.length) {
                if (child.parent) {
                    child.parent.removeChild(child);
                }
                child.setParent(this);
                this.children.splice(index, 0, child);
                child.updateTransform();
            }
            return child;
        }
        swapChildren(child1, child2) {
            if (child1 === child2) {
                return this;
            }
            const index1 = this.getChildIndex(child1);
            const index2 = this.getChildIndex(child2);
            if (index1 < 0 || index2 < 0) {
                throw new Error('swap: Both children must belong to the same parent');
            }
            this.children[index1] = child2;
            this.children[index2] = child1;
            return this;
        }
        getChildIndex(child) {
            const index = this.children.indexOf(child);
            if (index === -1) {
                throw new Error('Supplied DisplayObject not child of the caller');
            }
            return index;
        }
        setChildIndex(child, index) {
            const children = this.children;
            if (index < 0 || index >= children.length) {
                throw new Error('Index ' + index + ' out of bounds');
            }
            const currentIndex = this.getChildIndex(child);
            children.splice(currentIndex, 1);
            children.splice(index, 0, child);
            return this;
        }
        getChildAt(index) {
            if (index < 0 || index >= this.numChildren) {
                throw new Error('Index ' + index + ' out of bounds');
            }
            return this.children[index];
        }
        removeChild(child) {
            const index = this.children.indexOf(child);
            if (index === -1) {
                return;
            }
            return this.removeChildAt(index);
        }
        removeChildAt(index) {
            const child = this.getChildAt(index);
            if (child) {
                child.parent = undefined;
                child.updateTransform();
                this.children.splice(index, 1);
            }
            return child;
        }
        removeChildren(beginIndex = 0, endIndex) {
            const children = this.children;
            if (endIndex === undefined) {
                endIndex = children.length;
            }
            const range = endIndex - beginIndex;
            if (range > 0 && range <= endIndex) {
                const removed = children.splice(beginIndex, range);
                removed.forEach((child) => {
                    child.parent = undefined;
                    child.updateTransform();
                });
                return removed;
            }
            else if (range === 0 && children.length === 0) {
                return [];
            }
            else {
                throw new Error('Range Error. Values out of bounds');
            }
        }
        update(dt, now) {
            const children = this.children;
            for (let i = 0; i < children.length; i++) {
                children[i].update(dt, now);
            }
        }
        get numChildren() {
            return this.children.length;
        }
    };
}
//# sourceMappingURL=ContainerComponent.js.map