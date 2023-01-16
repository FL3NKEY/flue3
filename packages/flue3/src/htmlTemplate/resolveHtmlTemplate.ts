import fs from 'fs';
import path from 'path';
import { WORKDIR, TEMPLATES_PATH } from '../constants/constants.js';
import {
    htmlImplementSPALoading,
    htmlTemplateImplementAppId,
    htmlTemplateImplementEntrypoint,
} from './htmlTemplateImplements.js';

export const resolveHtmlTemplatePath = (ssr: boolean) => {
    return path.resolve(TEMPLATES_PATH, ssr ? 'index.ssr.html' : 'index.spa.html');
};

export const resolveLoadingTemplatePath = (src: string, file: string) => {
    let templatePath = path.resolve(WORKDIR, src, file);

    if (!templatePath.endsWith('.html')) {
        templatePath += '.html';
    }

    return templatePath;
};

export const resolveHtmlTemplate = ({
    ssr,
    appId,
    srcPath,
    entryFilename,
    loadingTemplateFilename,
}: {
    ssr: boolean;
    appId: string;
    srcPath: string;
    entryFilename: string;
    loadingTemplateFilename: string | false;
}) => {
    let template = fs.readFileSync(
        resolveHtmlTemplatePath(ssr),
        'utf-8',
    );

    template = htmlTemplateImplementAppId(template, appId);
    template = htmlTemplateImplementEntrypoint(template, entryFilename);

    if (!ssr) {
        if (loadingTemplateFilename) {
            const loadingTemplate = fs.readFileSync(
                resolveLoadingTemplatePath(srcPath, loadingTemplateFilename),
                'utf-8',
            );
            template = htmlImplementSPALoading(template, loadingTemplate);
        } else {
            template = htmlImplementSPALoading(template, '');
        }
    }

    return template;
};
