/**
 * Copyright (c) 2020 WebMMB contributors, licensed under MIT, See LICENSE file for details.
 *
 * @author Michal Malý (michal.maly@ibt.cas.cz)
 * @author Samuel C. Flores (samuelfloresc@gmail.com)
 * @author Jiří Černý (jiri.cerny@ibt.cas.cz)
 */

import * as React from 'react';
import { ErrorBox } from './common/error-box';
import { LinkButton } from './common/link-button';
import { PushButton } from './common/push-button';
import { TooltippedField } from './common/tooltipped-field';

declare let WebMmbViewer: any;

function forceResize() {
    const elem = document.getElementById('viewer');
    if (elem) {
        const forceResize = new Event('resize', { bubbles: true });
        elem.dispatchEvent(forceResize);
    }
}

interface State {
    autoRefreshEnabled: boolean;
    autoRefreshInterval: number | null;
    selectedStage?: string
}

export class Viewer extends React.Component<Viewer.Props, State> {
    constructor(props: Viewer.Props) {
        super(props);

        this.state = {
            autoRefreshEnabled: this.props.defaultAutoRefreshEnabled,
            autoRefreshInterval: this.props.defaultAutoRefreshInterval,
        };

        this.renderMmbOutput = this.renderMmbOutput.bind(this);
    }

    private clear() {
        WebMmbViewer.clear();
    }

    private async initAndLoad() {
        await WebMmbViewer.init(document.getElementById('viewer'));
        this.load();
    }

    private load() {
        const url = this.url();
        if (url !== undefined)
            WebMmbViewer.load(url, 'pdb');
    }

    private renderMmbOutput() {
        const output = this.props.mmbOutput;

        if (output.text === undefined && output.errors === undefined)
            return undefined;

        return (
            <div className='section'>
                <div className='section-caption'>MMB Output</div>
                {(() => {
                if (output.errors !== undefined)
                    return (<ErrorBox errors={output.errors} />);
                if (output.text !== undefined)
                    return (<pre className='mmb-output' id='mmb-output-item'>{output.text}</pre>);
                })()}
            </div>
        );
    }

    private switchRepresentation(repr: 'ball-and-stick' | 'cartoon') {
        WebMmbViewer.setRepresentation(repr);
    }

    private url() {
        if (this.props.structureUrl === undefined)
            return undefined;
        const stage = this.state.selectedStage ?? 'last';
        return `./${this.props.structureUrl}/${stage}`;
    }

    componentDidMount() {
        this.initAndLoad();
    }

    componentDidUpdate(prevProps: Viewer.Props, prevState: State) {
        if (this.props.step === 0 && prevProps.step !== 0)
            this.clear();
        else if (this.props.availableStages.length !== prevProps.availableStages.length ||
                 this.props.step !== prevProps.step ||
                 this.state.selectedStage !== prevState.selectedStage)
            this.load();

        const mmbOutput = document.getElementById('mmb-output-item');
        if (mmbOutput !== null)
            mmbOutput.scrollTo(0, mmbOutput.scrollHeight);

        forceResize();
    }

    render() {
        const stageOptions = this.props.availableStages.map(n => { return{ caption: n.toString(), value: n.toString() }} );
        const stageValue = (() => {
            if (this.state.selectedStage)
                return this.state.selectedStage;
            const len = stageOptions.length;
            if (len < 1)
                return undefined;
            return stageOptions[len - 1].value;
        })();

        return (
            <div className='viewer-container'>
                <div id='viewer'></div>
                <div className='viewer-controls'>
                    <PushButton
                        className='pushbutton-common pushbutton-flex pushbutton-clr-default pushbutton-hclr-default'
                        value='Ball-and-stick'
                        onClick={() => this.switchRepresentation('ball-and-stick')} />
                    <PushButton
                        className='pushbutton-common pushbutton-flex pushbutton-clr-default pushbutton-hclr-default'
                        value='Cartoon'
                        onClick={() => this.switchRepresentation('cartoon')} />
                    <LinkButton
                        className='pushbutton-common pushbutton-flex pushbutton-clr-default pushbutton-hclr-default'
                        classNameDisabled='pushbutton-common pushbutton-flex pushbutton-clr-default-disabled'
                        value='Download'
                        url={this.url()}
                        downloadAs={`${this.props.structureName}.pdb`} />
                </div>
                <div className='padded'>
                    <TooltippedField
                        position='above'
                        text='Select which stage of simulation to display'
                        renderContent={() => (<span className='padded'>Show stage:</span>)} />
                    <select
                        value={stageValue}
                        onChange={e => this.setState({...this.state, selectedStage: e.currentTarget.value}) }
                    >
                        {stageOptions.map(o => (<option key={o.value}>{o.caption}</option>))}
                    </select>
                    <TooltippedField
                        position='above'
                        text='Query the server for job status automatically every N seconds'
                        renderContent={() => (<span className='padded'>Refresh rate (sec):</span>)} />
                    <input
                        type='text'
                        onChange={
                            e => {
                                const val = (() => {
                                    const v = e.currentTarget.value;
                                    if (v.length === 0)
                                        return null;
                                    const i = parseInt(v);
                                    if (i <= 0)
                                        throw new Error('Invalid interval value');
                                    return i;
                                })();
                                this.setState({...this.state, autoRefreshInterval: val});
                                if (val !== null)
                                    this.props.autoRefreshChanged(this.state.autoRefreshEnabled, val);
                            }
                        }
                        value={this.state.autoRefreshInterval === null ? '' : this.state.autoRefreshInterval}
                        className='padded' />
                    <TooltippedField
                        position='above'
                        text='Enable/disable automatic refresh'
                        renderContent={() => (<span className='padded'>Auto:</span>)} />
                    <input
                        type='checkbox'
                        onChange={
                            e => {
                                const chk = e.currentTarget.checked;
                                this.setState({...this.state, autoRefreshEnabled: chk});
                                if (this.state.autoRefreshInterval !== null)
                                    this.props.autoRefreshChanged(chk, this.state.autoRefreshInterval);
                            }
                        }
                        checked={this.state.autoRefreshEnabled}
                        className='padded checkbox' />
                </div>
                {this.renderMmbOutput()}
            </div>
        );
    }
}

export namespace Viewer {
    export interface AutoRefreshChanged {
        (enabled: boolean, interval: number): void;
    }

    export interface MmbOutput {
        text?: string;
        errors?: string[];
    }

    export interface Props {
        structureUrl?: string;
        structureName?: string;
        step: number;
        autoRefreshChanged: AutoRefreshChanged;
        defaultAutoRefreshEnabled: boolean;
        defaultAutoRefreshInterval: number;
        mmbOutput: MmbOutput;
        availableStages: number[];
    }
}