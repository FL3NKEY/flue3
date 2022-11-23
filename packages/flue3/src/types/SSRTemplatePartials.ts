export interface SSRTemplatePartials {
    htmlAttrs?: string;
    bodyAttrs?: string;
    headTags?: string;
    body?: string;
    teleports?: Record<string, string>;
}
