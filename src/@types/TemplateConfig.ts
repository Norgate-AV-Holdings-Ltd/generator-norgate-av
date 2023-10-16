import PathMap from "./PathMap";
import GeneratorSignature from "./GeneratorSignature";
import PackageManager from "./PackageManager";

type TemplateConfig = {
    signature: GeneratorSignature;
    pkgmanager: PackageManager;
    paths: Array<PathMap>;
};

export default TemplateConfig;
