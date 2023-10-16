import GeneratorSignature from "./GeneratorSignature";

type PackageManagerRef = {
    $ref: string;
};

type PackageManagerResolvedRef = {
    default: string;
    choices: Array<string>;
};

type TemplateConfig = {
    signature: GeneratorSignature;
    pkgmanager: PackageManagerRef | PackageManagerResolvedRef;
};

type Config = {
    templates: Record<string, TemplateConfig>;
    pkgmanager: Record<string, PackageManagerResolvedRef>;
};
