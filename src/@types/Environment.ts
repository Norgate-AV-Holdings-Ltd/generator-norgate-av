// export type Environment = {
//     engine: {
//         fallback: string;
//     };
//     pkgmanager: PackageManager;
// };

export interface EnvironmentInterface {
    initialize(): Promise<void>;
    getEngine(): string;
}
