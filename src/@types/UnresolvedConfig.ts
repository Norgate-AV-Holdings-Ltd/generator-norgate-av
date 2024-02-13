import { Config, JsonRef, TemplateConfig } from "./index.js";

export type UnresolvedConfig = Config & {
    generators: {
        [key: string]: TemplateConfig<Array<JsonRef>, JsonRef>;
    };
};
