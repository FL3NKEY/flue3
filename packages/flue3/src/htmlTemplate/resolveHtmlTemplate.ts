import fs from 'fs-extra';
import path from 'path';
import { WORKDIR, TEMPLATES_PATH } from '../constants/constants.js';
import {
    htmlTemplateImplementHead,
    htmlTemplateImplementSPALoading,
    htmlTemplateImplementAppId,
    htmlTemplateImplementEntrypoint,
} from './htmlTemplateImplements.js';
import { Config } from '../types/Config.js';
import mustache from 'mustache';

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
    appConfig,
    ssr,
    appId,
    srcPath,
    entryFilename,
    loadingTemplateFilename,
    headTemplateFilename,
}: {
    appConfig: Config['appConfig'];
    ssr: boolean;
    appId: string;
    srcPath: string;
    entryFilename: string;
    loadingTemplateFilename: string | false;
    headTemplateFilename: string | false;
}) => {
    let template = fs.readFileSync(
        resolveHtmlTemplatePath(ssr),
        'utf-8',
    );

    template = htmlTemplateImplementAppId(template, appId);
    template = htmlTemplateImplementEntrypoint(template, path.join('/', entryFilename));

    if (headTemplateFilename) {
        const headTemplate = fs.readFileSync(
            resolveLoadingTemplatePath(srcPath, headTemplateFilename),
            'utf-8',
        );
        template = htmlTemplateImplementHead(template, headTemplate);
    } else {
        template = htmlTemplateImplementHead(template, '');
    }

    if (!ssr) {
        if (loadingTemplateFilename) {
            const loadingTemplate = fs.readFileSync(
                resolveLoadingTemplatePath(srcPath, loadingTemplateFilename),
                'utf-8',
            );
            template = htmlTemplateImplementSPALoading(template, loadingTemplate);
        } else {
            template = htmlTemplateImplementSPALoading(template, '');
        }
    }

    return mustache.render(template, {
        appConfig,
    });
};
