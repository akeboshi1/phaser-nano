export default function Install(baseClass, components) {
    let newClass = baseClass;
    components.forEach(component => {
        newClass = component(newClass);
    });
    return newClass;
}
//# sourceMappingURL=Install.js.map