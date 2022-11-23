import copyfiles from 'copyfiles';

export const copyFiles = (src: string[], dest: string) => {
    return new Promise((resolve, reject) => {
        copyfiles([...src, dest], {
            up: true,
        }, (err) => {
            if (err) {
                reject(err);
            }

            resolve(true);
        });
    });
};
