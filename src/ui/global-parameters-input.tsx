/**
 * Copyright (c) 2020 WebMMB contributors, licensed under MIT, See LICENSE file for details.
 *
 * @author Michal Malý (michal.maly@ibt.cas.cz)
 * @author Samuel C. Flores (samuelfloresc@gmail.com)
 * @author Jiří Černý (jiri.cerny@ibt.cas.cz)
 */

import * as React from 'react';
import { FormContextManager as FCM } from './form-context-manager';
import { FormBlock } from './common/form-block';
import { LabeledCheckBox, LabeledField, GLabeledField } from './common/labeled-field';
import { MmbInputUtil as MmbUtil, MMBFU } from './mmb-input-form-util';
import { GlobalConfig } from '../model/global-config';
import { Reporting } from '../model/reporting';

const NumLabeledField = LabeledField<MmbUtil.ErrorKeys, MmbUtil.ValueKeys, MmbUtil.Values, number>();
const CheckBox = LabeledCheckBox<MmbUtil.ErrorKeys, MmbUtil.ValueKeys, MmbUtil.Values>();

class GlobalParametersInputInner extends FormBlock<GlobalParametersInputInner.Props> {
    componentDidMount() {
        const bisf = MMBFU.getScalar(this.props.ctxData, 'mol-in-gp-bisf', GlobalConfig.Defaults.baseInteractionScaleFactor);
        const temperature = MMBFU.getScalar(this.props.ctxData, 'mol-in-gp-temperature', GlobalConfig.Defaults.temperature);
        const repInt = MMBFU.getScalar(this.props.ctxData, 'mol-in-gp-reporting-interval', Reporting.Defaults.interval);
        const repCount = MMBFU.getScalar(this.props.ctxData, 'mol-in-gp-num-reports', Reporting.Defaults.count);
        MMBFU.updateValues(
            this.props.ctxData,
            [
                { key: 'mol-in-gp-bisf', value: bisf },
                { key: 'mol-in-gp-temperature', value: temperature },
                { key: 'mol-in-gp-reporting-interval', value: repInt },
                { key: 'mol-in-gp-num-reports', value: repCount },
            ]);
    }

    render() {
        return (
            <div className='section'>
                <div className='section-caption'>Global parameters</div>
                <div className='mol-in-gp-input'>
                    <NumLabeledField
                        {...GLabeledField.tags('mol-in-gp-bisf', this.props.formId, ['labeled-field-concise'])}
                        formId={this.props.formId}
                        label='Interaction scale factor'
                        tooltip='baseInteractionScaleFactor'
                        position='above'
                        inputType='line-edit'
                        options={[]} />
                    <NumLabeledField
                        {...GLabeledField.tags('mol-in-gp-reporting-interval', this.props.formId, ['labeled-field-concise'])}
                        formId={this.props.formId}
                        label='Reporting interval'
                        tooltip='reportingInterval'
                        position='above'
                        inputType='line-edit'
                        options={[]} />
                    <NumLabeledField
                        {...GLabeledField.tags('mol-in-gp-num-reports', this.props.formId, ['labeled-field-concise'])} 
                        formId={this.props.formId}
                        label='Number of reports'
                        tooltip='numReportingIntervals'
                        position='above'
                        inputType='line-edit'
                        options={[]} />
                    <NumLabeledField
                        {...GLabeledField.tags('mol-in-gp-temperature', this.props.formId, ['labeled-field-concise'])} 
                        formId={this.props.formId}
                        label='Temperature'
                        tooltip='temperature'
                        position='above'
                        inputType='line-edit'
                        options={[]} />
                    <CheckBox
                        {...GLabeledField.tags('mol-in-gp-def-md-params', this.props.formId, ['labeled-field-concise'])}
                        formId={this.props.formId}
                        label='Turn on electrostatic and Lennard-Jones forces'
                        tooltip='setDefaultMDParameters'
                        position='left'
                        inputType='check-box'
                        options={[]} />
                </div>
            </div>
        );
    }
}

namespace GlobalParametersInputInner {
    export interface Props extends FormBlock.Props {
        ctxData: MmbUtil.ContextData;
    }
}

export class GlobalParametersInput extends FormBlock<GlobalParametersInput.Props> {
    render() {
        const CC = FCM.getContext(this.props.formId).Consumer;

        return (
            <CC>
                {(data: MmbUtil.ContextData) =>
                    <GlobalParametersInputInner {...this.props} ctxData={data} />
                }
            </CC>
        );
    }
}

export namespace GlobalParametersInput {
    export interface Props extends FormBlock.Props {
    }
}
