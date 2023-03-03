import { defineComponent, h } from 'vue';

export default defineComponent({
    name: 'AppError',
    props: {
        error: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        return () => h('div', {
            style: `
                box-sizing: border-box;
                position: absolute;
                left: 0;
                top: 0;
                min-height: 100vh;
                width: 100%;
                z-index: 100;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue",sans-serif;
                background: #111114;
                color: #fff;
                padding: 2em;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            `,
        }, [
            h('h1', {
                style: 'font-size: 5em; margin: 0px 0px 0.2em;',
            }, props.error?.status || 500),
            h('p', {
                style: 'font-size: 1.5em; margin: 0.25em 0px 0.75em;',
            }, props.error?.message ?? 'Some error occurred'),
            h('p', {
                style: 'margin: 2em 0 1em',
                innerHTML: '<svg width="78" height="20" viewBox="0 0 78 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.3781 6.888L36.7511 6.888L36.7511 9.234L26.3781 9.234L26.3781 6.888ZM33.3241 1.253L33.3241 3.645C33.1554 3.645 32.9867 3.645 32.8181 3.645C32.6647 3.645 32.5037 3.645 32.3351 3.645C31.7064 3.645 31.2924 3.81367 31.0931 4.151C30.8937 4.48833 30.7941 4.94067 30.7941 5.508L30.794 18.25L28.011 18.25L28.0111 5.508C28.0111 4.46533 28.1721 3.62967 28.4941 3.001C28.8161 2.357 29.2684 1.88933 29.8511 1.598C30.4337 1.29133 31.1084 1.138 31.8751 1.138C32.0897 1.138 32.3197 1.14567 32.5651 1.161C32.8257 1.17633 33.0787 1.207 33.3241 1.253ZM38.131 18.25L35.3251 18.25L35.3251 1.138L38.1311 1.138L38.131 18.25Z" fill="white"/><path d="M48.524 6.888L51.33 6.888L51.33 18.25L48.731 18.25L48.524 16.732C48.1867 17.2687 47.6807 17.7057 47.006 18.043C46.3313 18.3803 45.6107 18.549 44.844 18.549C43.5407 18.549 42.521 18.135 41.785 17.307C41.049 16.479 40.681 15.375 40.681 13.995L40.681 6.888L43.487 6.888L43.487 13.006C43.487 14.0793 43.694 14.8537 44.108 15.329C44.522 15.8043 45.12 16.042 45.902 16.042C46.7913 16.042 47.4507 15.7813 47.88 15.26C48.3093 14.7233 48.524 13.9183 48.524 12.845L48.524 6.888Z" fill="white"/><path d="M58.8566 18.549C57.7372 18.549 56.7406 18.296 55.8666 17.79C55.0079 17.2687 54.3332 16.5633 53.8426 15.674C53.3519 14.7693 53.1066 13.7343 53.1066 12.569C53.1066 11.3883 53.3442 10.3457 53.8196 9.44101C54.2949 8.53634 54.9619 7.83101 55.8206 7.32501C56.6792 6.80367 57.6606 6.54301 58.7646 6.54301C59.9146 6.54301 60.9036 6.78834 61.7316 7.27901C62.5596 7.75434 63.1959 8.42134 63.6406 9.28001C64.1006 10.1387 64.3306 11.166 64.3306 12.362L64.3306 13.213L54.5786 13.236L54.6246 11.442L61.5476 11.442C61.5476 10.66 61.2946 10.0313 60.7886 9.55601C60.2979 9.08067 59.6309 8.84301 58.7876 8.84301C58.1282 8.84301 57.5686 8.98101 57.1086 9.25701C56.6639 9.53301 56.3266 9.94701 56.0966 10.499C55.8666 11.051 55.7516 11.7257 55.7516 12.523C55.7516 13.7497 56.0122 14.6773 56.5336 15.306C57.0702 15.9347 57.8599 16.249 58.9026 16.249C59.6692 16.249 60.2979 16.1033 60.7886 15.812C61.2946 15.5207 61.6242 15.1067 61.7776 14.57L64.3766 14.57C64.1312 15.812 63.5179 16.7857 62.5366 17.491C61.5706 18.1963 60.3439 18.549 58.8566 18.549Z" fill="white"/><path d="M76.8113 3.78301L70.7393 9.37201L68.8073 8.01501L74.6953 2.61001L74.1893 4.03601L66.1393 4.03601L66.1393 1.43701L76.8113 1.43701L76.8113 3.78301ZM70.8543 9.92401L68.8073 9.92401L68.8073 8.01501C69.0986 7.78501 69.482 7.63167 69.9573 7.55501C70.4326 7.46301 70.8773 7.41701 71.2913 7.41701C72.0886 7.41701 72.8476 7.53968 73.5683 7.78501C74.289 8.03034 74.9253 8.39068 75.4773 8.86601C76.0446 9.32601 76.4893 9.90101 76.8113 10.591C77.1333 11.2657 77.2943 12.04 77.2943 12.914C77.2943 14.064 77.026 15.0607 76.4893 15.904C75.9526 16.7473 75.2166 17.399 74.2813 17.859C73.3613 18.319 72.334 18.549 71.1993 18.549C70.0953 18.549 69.0986 18.3343 68.2093 17.905C67.3353 17.4603 66.6376 16.8163 66.1163 15.973C65.6103 15.1297 65.3573 14.1023 65.3573 12.891L68.2553 12.891C68.2553 13.857 68.5236 14.6083 69.0603 15.145C69.6123 15.6663 70.3406 15.927 71.2453 15.927C72.1653 15.927 72.9013 15.651 73.4533 15.099C74.0206 14.5317 74.3043 13.788 74.3043 12.868C74.3043 12.0247 74.0206 11.327 73.4533 10.775C72.886 10.2077 72.0196 9.92401 70.8543 9.92401Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1 2.91881L10.5 17.9188H12.612L22.112 2.91882L21.056 1H2.05602L1 2.91881ZM18.7848 3.5L11.556 14.9138L4.3273 3.5L9.21228 3.5L11.556 7.25L13.8998 3.5L18.7848 3.5Z" fill="#4EFFD5"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1 2.91881L10.5 17.9188H12.612L22.112 2.91882L21.056 1H2.05602L1 2.91881ZM18.7848 3.5L11.556 14.9138L4.3273 3.5L9.21228 3.5L11.556 7.25L13.8998 3.5L18.7848 3.5Z" fill="url(#paint0_linear_9_164)"/><defs><linearGradient id="paint0_linear_9_164" x1="1.05603" y1="1.25" x2="22.056" y2="18.25" gradientUnits="userSpaceOnUse"><stop stop-color="#34FECE"/><stop offset="1" stop-color="#5B67E3"/></linearGradient></defs></svg>',
            }),
            h('div', {
                style: `
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border-radius: 100%;
                        background: linear-gradient(122.97deg, rgb(52, 254, 206) 0.74%, rgb(91, 103, 227) 100.61%), rgb(217, 217, 217);
                        opacity: 0.5;
                        filter: blur(200px);
                        z-index: -1;
                `,
            }),
        ]);
    },
});
