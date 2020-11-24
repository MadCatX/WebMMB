/**
 * Copyright (c) 2020 WebMMB contributors, licensed under MIT, See LICENSE file for details.
 *
 * @author Michal Malý (michal.maly@ibt.cas.cz)
 * @author Samuel C. Flores (samuelfloresc@gmail.com)
 * @author Jiří Černý (jiri.cerny@ibt.cas.cz)
 */

import * as React from 'react';

export class TooltippedField extends React.Component<TooltippedField.Props> {
    constructor(props: TooltippedField.Props) {
        super(props);

        this.renderTooltip = this.renderTooltip.bind(this);
    }

    private renderTooltip() {
        if (this.props.text === undefined)
            return undefined;

        const cls = `tooltip-${this.props.position}`;
        return (<span className={cls}>{this.props.text}</span>);
    }

    render() {
        return (
            <div className='tooltip-container'>
                {this.renderTooltip()}
                {this.props.renderContent()}
            </div>
        );
    }
}

export namespace TooltippedField {
    export type Position = 'above' | 'left'

    export interface ContentRenderer {
        (): React.ReactFragment;
    }

    export interface Props {
        position: Position;
        renderContent: ContentRenderer; 
        text?: string;
    }
}