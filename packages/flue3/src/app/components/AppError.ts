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
                background-color: rgb(19 30 31);
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
                style: 'font-size: 1em; margin: 1em 0;',
            }, 'flue3'),
        ]);
    },
});
