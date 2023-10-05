import Template from "./Template";
import ClangTemplate from "./ClangTemplate";

class TemplateFactory {
    public static createTemplate(id: string): Template {
        switch (id) {
            case "template-c":
                return new ClangTemplate();

            default:
                throw new Error(`Unknown template id: ${id}`);
        }
    }
}

export default TemplateFactory;
