import fs from 'fs';
import path from 'path';
import { TEMPLATES_PATH } from '../constants/constants.js';
import { htmlTemplateImplementAppId, htmlTemplateImplementEntrypoint } from './htmlTemplateImplements.js';

export const resolveHtmlTemplatePath = (ssr: boolean) => {
    return path.resolve(TEMPLATES_PATH, ssr ? 'index.ssr.html' : 'index.spa.html');
};

export const resolveHtmlTemplate = ({
    ssr,
    appId,
    entryFilename,
}: {
    ssr: boolean;
    appId: string;
    entryFilename: string;
}) => {
    let template = fs.readFileSync(
        resolveHtmlTemplatePath(ssr),
        'utf-8',
    );

    template = htmlTemplateImplementAppId(template, appId);
    template = htmlTemplateImplementEntrypoint(template, entryFilename);

    return template;
};
