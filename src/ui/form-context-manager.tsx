import * as React from 'react';
import { FormUtil } from './common/form';

const ActiveContexts = new Map<string, any>();

export namespace FormContextManager {
    export function getContext(id: string) {
        const ctx = ActiveContexts.get(id);
        if (ctx === undefined)
            throw new Error(`Context ${id} is not registered`);

        return ctx;
    }

    export function registerContext<KE, KV, T>(id: string) {
        if (ActiveContexts.has(id))
            throw new Error(`Context ${id} is already registered`);

        const ctx = makeContext<KE, KV, T>();
        ActiveContexts.set(id, ctx);
        return ctx;
    }

    export function unregisterContext(id: string) {
        if (ActiveContexts.has(id))
            ActiveContexts.delete(id);
    }

    export function makeContext<KE, KV, T>() {
        return React.createContext<FormUtil.ContextData<KE, KV, T>>(
            {
                errors: new Map<KE, string[]>(),
                values: new Map<KV, FormUtil.V<T>>(),
                setErrors: () => {},
                setValues: () => {},
                setErrorsAndValues: () => {}
            },
        );
    }
}
