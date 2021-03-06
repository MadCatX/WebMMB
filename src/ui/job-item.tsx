/**
 * Copyright (c) 2020 WebMMB contributors, licensed under MIT, See LICENSE file for details.
 *
 * @author Michal Malý (michal.maly@ibt.cas.cz)
 * @author Samuel C. Flores (samuelfloresc@gmail.com)
 * @author Jiří Černý (jiri.cerny@ibt.cas.cz)
 */

import * as React from 'react';
import * as Api from '../mmb/api';
import { CloneJobButton } from './clone-job-button';
import { PushButton } from './common/push-button';

function padStr(num: number) {
    let s = num.toString();
    while (s.length < 2)
        s = '0' + s;
    return s;
}

export class JobItem extends React.Component<JobItem.Props> {
    private renderJobStatus(s: Api.JobState) {
        switch (s) {
        case 'NotStarted':
            return (<span className='centered-text ok-message'>Not started</span>);
        case 'Running':
            return (<span className='centered-text ok-message'>Running</span>);
        case 'Finished':
            return (<span className='centered-text job-done-message'>Finished</span>);
        case 'Failed':
            return (<span className='centered-text error-message'>Failed</span>);
        default:
            return (<span className='centered-text error-message'>Unknown</span>);
        }
    }

    private renderTime(epoch: number) {
        if (epoch === 0) {
            return (
                <span className='centered-text error-message'>Invalid date</span>
            );
        }

        const date = new Date();
        date.setTime(epoch);

        return (
            <span className='centered-text'>
                {`${date.getFullYear()}-${padStr(date.getMonth() + 1)}-${padStr(date.getDate())} ${padStr(date.getHours())}:${padStr(date.getMinutes())}:${padStr(date.getSeconds())}`}
            </span>
        );
    }

    render() {
        return (
            <div className='job-item'>
                <span className='centered-text job-item-name'>{this.props.name}</span>
                {this.renderJobStatus(this.props.state)}
                {this.renderTime(this.props.created_on)}
                <PushButton
                    className='pushbutton-common pushbutton-chained pushbutton-clr-default pushbutton-hclr-default'
                    value='Show >>'
                    onClick={() => this.props.onSelect(this.props.id)} />
                <CloneJobButton
                    id={this.props.id}
                    sourceName={this.props.name}
                    notifyCloned={(id: string) => this.props.notifyCloned(id) } />
                <PushButton
                    className='pushbutton-common pushbutton-chained pushbutton-clr-default pushbutton-hclr-red'
                    value='Delete'
                    onClick={() => this.props.onDelete(this.props.id)} />
            </div>
        );
    }
}

export namespace JobItem {
    export interface ActionHandler {
        (id: string): void;
    }

    export interface Props {
        id: string;
        name: string;
        state: Api.JobState;
        created_on: number;
        notifyCloned: ActionHandler;
        onSelect: ActionHandler;
        onDelete: ActionHandler;
    }
}