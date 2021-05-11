/**
 * Copyright (c) 2020 WebMMB contributors, licensed under MIT, See LICENSE file for details.
 *
 * @author Michal Malý (michal.maly@ibt.cas.cz)
 * @author Samuel C. Flores (samuelfloresc@gmail.com)
 * @author Jiří Černý (jiri.cerny@ibt.cas.cz)
 */


import * as Api from './api';
import { Request } from './request';

const utf8Enc = new TextEncoder();

export namespace FileRequest {
    export function del(jobId: string, fileName: string) {
        const req: Api.ApiRequest<Api.FileOperationRqData> = {
            req_type: 'FileOperation',
            data: {
                req_type: 'Delete',
                job_id: jobId,
                transfer_id: '',
                file_name: fileName,
            },
        };
        return Request.api(req);
    }

    export function finishUpload(jobId: string, transferId: string) {
        const req: Api.ApiRequest<Api.FileOperationRqData> = {
            req_type: 'FileOperation',
            data: {
                req_type: 'FinishUpload',
                job_id: jobId,
                transfer_id: transferId,
                file_name: '',
            },
        };
        return Request.api(req);
    }

    export function initUpload(jobId: string, fileName: string) {
        const req: Api.ApiRequest<Api.FileOperationRqData> = {
            req_type: 'FileOperation',
            data: {
                req_type: 'InitUpload',
                job_id: jobId,
                transfer_id: '',
                file_name: fileName,
            },
        };
        return Request.api(req);
    }

    export function uploadChunk(jobId: string, transferId: string, data: Uint8Array) {
        const job_id = utf8Enc.encode(jobId);
        const transfer_id = utf8Enc.encode(transferId);

        const req: Api.TransferChunk = {
            job_id,
            transfer_id,
            data,
        };
        return Request.xfr(req);
    }

    export function uploadChunkUint8(jobId: Uint8Array, transferId: Uint8Array, data: Uint8Array) {
        const req: Api.TransferChunk = {
            job_id: jobId,
            transfer_id: transferId,
            data,
        };
        return Request.xfr(req);
    }
}
