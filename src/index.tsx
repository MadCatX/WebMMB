/**
 * Copyright (c) 2020 WebMMB contributors, licensed under MIT, See LICENSE file for details.
 *
 * @author Michal Malý (michal.maly@ibt.cas.cz)
 * @author Samuel C. Flores (samuelfloresc@gmail.com)
 * @author Jiří Černý (jiri.cerny@ibt.cas.cz)
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { isExtResAvailable } from './external-resources-loader';
import { ExampleList } from './ui/example-list';
import { JobList } from './ui/job-list';
import { Logout } from './ui/logout';
import { TabsBar } from './ui/tabs-bar';
import { VisualJobRunner } from './ui/visual-job-runner';
import { ExternalResourcesLoader } from './external-resources-loader';
import * as Api from './mmb/api';
import { AppQuery } from './mmb/app-query';
import { Response } from './mmb/response';
import { ResponseDeserializers } from './mmb/response-deserializers';
import { MmbInputModel as MIM } from './model/mmb-input-model';
import { Net } from './util/net';
import { versionInfo } from './version';

type Tabs = 'job-list' | 'job-control' | 'example-list';

type ActiveJob = {
    info: Api.JobInfo,
    setup: MIM.Values,
}

interface State {
    session_id?: string;
    activeTab: Tabs;
    activeJob?: ActiveJob;
}

interface Props {
}

const NavTabsBar = TabsBar<Tabs>();

export class Main extends React.Component<Props, State> {
    private sessionInfoAborter: AbortController | null = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            session_id: undefined,
            activeTab: 'job-list',
            activeJob: undefined,
        };

        this.onSelectJob = this.onSelectJob.bind(this);
        this.onJobDeleted = this.onJobDeleted.bind(this);
        this.onJobStarted = this.onJobStarted.bind(this);
        this.onTabChanged = this.onTabChanged.bind(this);
        this.onExampleSelected = this.onExampleSelected.bind(this);
    }

    private allowJobControl() {
        return this.state.session_id !== undefined && isExtResAvailable('molstar-app');
    }

    private onExampleSelected(info: Api.JobInfo, setup: MIM.Values) {
        this.onSelectJob(info, setup);
    }

    private onJobDeleted(id: string) {
        if (this.state.activeJob?.info.id === id) {
            this.setState({
                ...this.state,
                activeJob: undefined,
            });
        }
    }

    private onJobStarted(info: Api.JobInfo, setup: MIM.Values) {
        this.setState({
            ...this.state,
            activeJob: { info, setup },
        });
    }

    private onSelectJob(info?: Api.JobInfo, setup?: MIM.Values) {
        if (!this.allowJobControl())
            return;

        const aj = (() => {
            if (info !== undefined && setup !== undefined)
                return { info, setup };
            return undefined;
        })();

        this.setState({
            ...this.state,
            activeTab: 'job-control',
            activeJob: aj,
        });
    }

    private onTabChanged(id: Tabs) {
        console.log(id);

        if (id === 'job-control' && !this.allowJobControl())
            return;

        this.setState({ ...this.state, activeTab: id });
    }

    private renderTab(id: Tabs) {
        switch (id) {
        case 'job-list':
            return (
                <JobList
                    onSelectJob={this.onSelectJob}
                    jobDeleted={this.onJobDeleted} />);
        case 'job-control':
            if (!this.allowJobControl())
                throw new Error('Job control is not available');

            return (
                <VisualJobRunner
                    username={this.state.session_id!}
                    onJobStarted={this.onJobStarted}
                    info={this.state.activeJob?.info}
                    setup={this.state.activeJob?.setup ?? MIM.defaultSetupValues()} />
                );
        case 'example-list':
            return (
                <ExampleList
                    onExampleSelected={this.onExampleSelected} />
            );
        }
    }

    componentDidMount() {
        Net.abortFetch(this.sessionInfoAborter);

        const { promise, aborter } = AppQuery.sessionInfo();
        this.sessionInfoAborter = aborter;

        promise.then(resp => {
            console.log('Requesting session info');

            resp.json().then(json => {
                if (Net.isFetchAborted(aborter))
                    return;

                const r = Response.parse(json, ResponseDeserializers.toSessionInfo);

                if (Response.isError(r)) {
                    throw new Error(`${resp.status}: Failed to get session info, ${r.message}`);
                } else if (Response.isOk(r)) {
                    this.setState({
                        ...this.state,
                        session_id: r.data.id,
                    });
                }
            }).catch(e => console.error(e.toString));
        }).catch(e => {
            if (Net.isAbortError(e))
                return;
            console.error(e.toString())
        });
    }

    componentWillUnmount() {
        Net.abortFetch(this.sessionInfoAborter);
    }

    render() {
        const verinfo = versionInfo();

        return (
            <div id='main-container'>
                <ExternalResourcesLoader />
                <div className='top-panel'>
                    <NavTabsBar
                        tabs={[
                            { id: 'job-list', caption: 'Jobs' },
                            { id: 'job-control', caption: 'Control' },
                            { id: 'example-list', caption: 'Examples' },
                        ]}
                        activeTab={this.state.activeTab}
                        changeTab={this.onTabChanged}
                        className='main-navbar' />
                    <Logout username={this.state.session_id} />
                </div>
                <div className='main-block'>
                    {this.renderTab(this.state.activeTab)}
                </div>
                <div className='footer'>
                    <div className='version-info-text'>{`Version: ${verinfo.date} (${verinfo.rev})`}</div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('app'));