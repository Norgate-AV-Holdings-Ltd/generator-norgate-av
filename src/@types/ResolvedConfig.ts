import {
    Config,
    GeneratorId,
    PackageManager,
    PathMap,
    TemplateConfig,
} from "./index.js";

export type ResolvedConfig = Config & {
    generators: {
        [K in GeneratorId]: TemplateConfig<Array<PathMap>, PackageManager>;
    };
};
