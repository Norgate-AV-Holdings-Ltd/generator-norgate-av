import { PackageManager } from "./index.js";

export type Environment = {
    engine: {
        fallback: string;
    };
    pkgmanager: PackageManager;
};
