import { PackageManager, PathMap, TemplateConfig } from "./index.js";

export type Config = {
    generators: {
        [key: string]: TemplateConfig;
    };
    files: {
        directory: string;
        paths: {
            [key: string]: PathMap;
        };
    };
    pkgmanager: {
        [key: string]: PackageManager;
    };
};
