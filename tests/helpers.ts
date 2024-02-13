export function getNodeDependencyObject(
    dependencies: Array<string>,
    store: Record<string, string>,
): Record<string, string> {
    return dependencies.reduce<Record<string, string>>((dependencies, key) => {
        const value = store[key];

        if (value === undefined) {
            return dependencies;
        }

        return {
            ...dependencies,
            [key]: value,
        };
    }, {});
}
