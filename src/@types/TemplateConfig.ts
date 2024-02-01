import { GeneratorSignature, PackageManager, PathMap } from "./index.js";

export type TemplateConfig = {
    signature: GeneratorSignature;
    pkgmanager: PackageManager;
    paths: Array<PathMap>;
};
