import PathMap from "./PathMap";
import PackageManager from "./PackageManager";
import TemplateConfig from "./TemplateConfig";

type Config = {
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

export default Config;
