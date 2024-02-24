import { GeneratorId } from "./index.js";

export type GeneratorSignature = {
    id: GeneratorId;
    name: string;
    aliases: Array<string>;
};
