import * as React from 'react';
import * as style from './style.scss';
import MarkdownRender from './MarkdownRender';

export default class App extends React.Component<{}, { text: string }> {
    private editorRef = React.createRef<HTMLElement>();
    constructor(props: {}) {
        super(props);
        this.state = {
            text: ''
        };
    }
    private handleInput = () => {
        const { current } = this.editorRef;
        this.setState({ text: current.innerText });
        const styledNodes = current.querySelectorAll('[style]');
        if (styledNodes.length < 1) {
            return;
        }
        styledNodes.forEach(value => value.removeAttribute('style'));
    };
    public render() {
        return (
            <section className={style.flex}>
                <section className={style.frame} contentEditable={true} ref={this.editorRef} onInput={this.handleInput} spellCheck={false} />
                <section className={style.frame}>
                    <MarkdownRender source={this.state.text} />
                </section>
            </section>
        )
    }
}