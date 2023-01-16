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
            style: 'text-align: center;',
        }, [
            h('h1', {
                style: 'font-size: 3em;',
            }, props.error?.status || 500),
            h('p', {
                style: 'font-size: 1.5em;',
            }, props.error?.message ?? 'Some error occurred'),
            h('hr'),
            h('p', 'flue3'),
        ]);
    },
});
