export type Type = "EmptyRequiredReference";

export default class ModelTransitionalError extends Error {
    public type: Type;
    public details: string;
    constructor(type: Type, details: string) {
        super("Model Error" + type + details);
        this.type = type;
        this.details = details;
    }
}
