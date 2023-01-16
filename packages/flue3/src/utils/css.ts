import { ModuleNode } from 'vite';

export const collectCssTagsFromModules = (
    mods: ModuleNode | Set<ModuleNode>,
    styles = new Map<string, string>(),
    checkedModules = new Set(),
) => {
    let currentMods = mods;

    if (!(currentMods instanceof Set)) {
        currentMods = new Set<ModuleNode>();
        currentMods.add(mods as ModuleNode);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const mod of currentMods) {
        if (
            (mod.file?.endsWith('.scss')
                || mod.file?.endsWith('.sass')
                || mod.file?.endsWith('.styl')
                || mod.file?.endsWith('.stylus')
                || mod.file?.endsWith('.css')
                || mod.id?.includes('vue&type=style'))
            && mod.ssrModule
        ) {
            styles.set(mod.id!, mod.ssrModule.default);
        }
        if (mod.importedModules.size > 0 && !checkedModules.has(mod.id)) {
            checkedModules.add(mod.id);
            collectCssTagsFromModules(mod.importedModules, styles, checkedModules);
        }
    }
    let result = '';
    styles.forEach((content, id) => {
        const styleTag = `<style type="text/css" data-vite-css-dev-id="${id}">${content}</style>`;
        result += styleTag;
    });
    return result;
};

export const removeCssHotReloaded = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [...document.querySelectorAll('style[data-vite-css-dev-id]')].forEach((el) => el.remove());
};
