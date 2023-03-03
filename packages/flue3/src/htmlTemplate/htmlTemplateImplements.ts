import { SSRRenderReturns } from '../types/SSRRenderReturns.js';

export const htmlTemplateImplementAppId = (template: string, appId: string) => {
    return template.replace(/#_FLUE3_APP_ID/g, appId);
};

export const htmlTemplateImplementEntrypoint = (template: string, entryFilename: string) => {
    return template.replace(
        '</body>',
        `<script src="${entryFilename}" type="module"></script></body>`,
    );
};

export const htmlTemplateImplementSSRBody = (template: string, ssrBody: string) => {
    return template.replace(
        '<!--#_FLUE3_SSR_BODY-->',
        ssrBody,
    );
};

export const htmlTemplateImplementHtmlAttrs = (template: string, htmlAttrs: string) => {
    return template.replace(
        '<html',
        `<html ${htmlAttrs}`,
    );
};

export const htmlTemplateImplementBodyAttrs = (template: string, bodyAttrs: string) => {
    return template.replace(
        '<body',
        `<body ${bodyAttrs}`,
    );
};

export const htmlTemplateImplementHeadTags = (template: string, headTags: string) => {
    return template.replace(
        '</head>',
        `${headTags}</head>`,
    );
};

export const htmlTemplateImplementTeleports = (template: string, teleports: SSRRenderReturns['teleports']) => {
    let templateWithTeleports = template;

    if (teleports?.body) {
        templateWithTeleports = templateWithTeleports.replace(
            'body>',
            `body>${teleports.body}`,
        );
    }

    return templateWithTeleports;
};

export const htmlTemplateImplementInitialState = (template: string, initialState: Record<any, any>) => {
    return template.replace(
        '</body>',
        `<script>window._FLUE3_INITIAL_STATE=${JSON.stringify(initialState)}</script></body>`,
    );
};

export const htmlTemplateImplementSPALoading = (template: string, loadingSource: string) => {
    return template.replace('<!--#_FLUE3_SPA_LOADING-->', loadingSource);
};

export const htmlTemplateImplementHead = (template: string, headSource: string) => {
    return template.replace('<!--#_FLUE3_HEAD-->', headSource);
};

export const htmlTemplateImplementSSR = (source: string, {
    body,
    htmlAttrs,
    bodyAttrs,
    headTags,
    teleports,
    initialState,
}: SSRRenderReturns = {}) => {
    let template = source;

    if (body) {
        template = htmlTemplateImplementSSRBody(template, body);
    }

    if (htmlAttrs) {
        template = htmlTemplateImplementHtmlAttrs(template, htmlAttrs);
    }

    if (bodyAttrs) {
        template = htmlTemplateImplementBodyAttrs(template, bodyAttrs);
    }

    if (headTags) {
        template = htmlTemplateImplementHeadTags(template, headTags);
    }

    template = htmlTemplateImplementTeleports(template, teleports);

    template = htmlTemplateImplementInitialState(template, initialState || {});

    return template;
};
