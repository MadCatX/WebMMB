import * as React from 'react';
import { FormUtil } from './form';
import { FormField } from './form-field';
import { CheckBox, GCheckBox } from './check-box';
import { ComboBox, GComboBox } from './combo-box';
import { LineEdit, GLineEdit } from './line-edit';
import { TextArea, GTextArea } from './text-area';

export class GLabeledField<KE, KV extends string, T, U extends FormUtil.V<T>> extends FormField<KE, KV, T, GLabeledField.Props<KV, T, U>> {
    /*static defaultProps = {
        ...GLineEdit.defaultProps,
        //  ...GTextArea.defaultProps,
    }*/ // Revisit this later

    private CheckBox = CheckBox<KE, KV, T>();
    private ComboBox = ComboBox<KE, KV, T, U>();
    private LineEdit = LineEdit<KE, KV, T>();
    private TextArea = TextArea<KE, KV, T>();

    private inputField(pos: GLabeledField.LabelPosition) {
        const cname = (pos === 'above') ? 'form-field-input-above' : 'form-field-input-left';

        switch (this.props.inputType) {
        case 'check-box':
            return (<this.CheckBox {...this.props} className={cname} />);
        case 'combo-box':
            return (<this.ComboBox {...this.props} className={cname} />);
        case 'line-edit':
            return (<this.LineEdit {...this.props} className={cname} />);
        case 'text-area':
            return (<this.TextArea {...this.props} className={cname} />);
        }
        return (<span></span>);
    }

    render() {
        switch (this.props.position) {
        case 'above':
            return (
                <div className={this.props.className}>
                    <div>
                        <label className="form-field-label" htmlFor={`${this.props.id}`}>{this.props.label}</label>
                    </div>
                    <div>
                        {this.inputField(this.props.position)}
                    </div>
                </div>
            );
        case 'left':
            return (
                <div className={this.props.className}>
                    <div>
                        <label className="form-field-label" htmlFor={`${this.props.id}`}>{this.props.label}</label>
                        {this.inputField(this.props.position)}
                    </div>
                </div>
            );
        }
    }
}

export namespace GLabeledField {
    export type LabelPosition = 'left' | 'above';
    export type InputType = 'line-edit' | 'combo-box' | 'text-area' | 'check-box';

    export interface Props<KV extends string, T, U extends FormUtil.V<T>> extends
                                       GLineEdit.Props<KV>,
                                       GComboBox.Props<KV, T, U>,
                                       GTextArea.Props<KV>,
                                       GCheckBox.Props<KV> {
        label: string;
        position: LabelPosition;
        inputType: InputType;
        className?: string;
    }

    export function tags<KV extends string>(base: KV, suffix: string, cn?: string[]) {
        return {
            id: `${base}-${suffix}`,
            className: cn ? cn.reduce((a, b) => `${a} ${b}`) : base,
            keyId: base,
        };
    }
}

export function LabeledField<KE, KV extends string, T, U extends FormUtil.V<T>>() {
    return GLabeledField as new(props: GLabeledField.Props<KV, T, U>) => GLabeledField<KE, KV, T, U>;
}

export function LabeledCheckBox<KE, KV extends string, T>() {
    return GLabeledField as new(props: GLabeledField.Props<KV, T, boolean>) => GLabeledField<KE, KV, T, boolean>;
}