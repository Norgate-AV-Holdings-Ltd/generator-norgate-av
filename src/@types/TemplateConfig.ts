import { GeneratorSignature } from "./index.js";

export type TemplateConfig<T, U> = {
    signature: GeneratorSignature;
    pkgmanager?: U;
    paths: T;
};
