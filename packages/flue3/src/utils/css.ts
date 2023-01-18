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
            styles.set(mod.id!, mod.url);
        }
        if (mod.importedModules.size > 0 && !checkedModules.has(mod.id)) {
            checkedModules.add(mod.id);
            collectCssTagsFromModules(mod.importedModules, styles, checkedModules);
        }
    }
    let result = '';
    styles.forEach((url, id) => {
        const styleTag = `<link rel="stylesheet" href="${url}" data-vite-css-dev-id="${id}"></link>`;
        result += styleTag;
    });
    return result;
};

export const removeCssHotReloaded = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [...document.querySelectorAll('link[data-vite-css-dev-id]')].forEach((el) => el.remove());
};
