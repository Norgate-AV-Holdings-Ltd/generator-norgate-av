import NodePackageManager from "./NodePackageManager";

type Answers = {
    type: string;
    displayName: string;
    name: string;
    description: string;
    git: boolean;
    pkg: NodePackageManager;
};

export default Answers;
