import { PackageManager, PathMap } from "./index.js";

export type Config = {
    files: {
        directory: string;
        paths: {
            [key: string]: PathMap;
        };
    };
    pkgmanager: {
        [key: string]: PackageManager;
    };
    environments: {
        node: {
            engine: {
                fallback: string;
            };
            pkgmanager: PackageManager;
        };
        python: {
            engine: {
                fallback: string;
            };
        };
    };
};
