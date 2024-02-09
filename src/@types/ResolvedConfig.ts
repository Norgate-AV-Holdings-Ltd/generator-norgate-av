import { Config, PackageManager, PathMap, TemplateConfig } from "./index.js";

export type ResolvedConfig = Config & {
    generators: {
        [key: string]: TemplateConfig<Array<PathMap>, PackageManager>;
    };
};
