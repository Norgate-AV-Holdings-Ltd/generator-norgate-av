const nameRegex = /^[a-z0-9][a-z0-9-]*$/i;

export function validatePublisher(publisher: string) {
    if (!publisher) {
        return "Missing publisher name";
    }

    if (!nameRegex.test(publisher)) {
        return "Invalid publisher name";
    }

    return true;
}

export function validateProjectId(id: string) {
    if (!id) {
        return "Missing project identifier";
    }

    if (!nameRegex.test(id)) {
        return "Invalid project identifier";
    }

    return true;
}

export function validateNonEmpty(name: string) {
    return name && name.length > 0;
}
