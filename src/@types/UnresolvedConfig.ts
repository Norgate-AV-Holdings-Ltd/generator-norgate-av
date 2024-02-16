import { Config, GeneratorId, JsonRef, TemplateConfig } from "./index.js";

export type UnresolvedConfig = Config & {
    generators: {
        [K in GeneratorId]: TemplateConfig<Array<JsonRef>, JsonRef>;
    };
};
