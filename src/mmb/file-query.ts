/**
 * Copyright (c) 2020-2021 WebMMB contributors, licensed under MIT, See LICENSE file for details.
 *
 * @author Michal Malý (michal.maly@ibt.cas.cz)
 * @author Samuel C. Flores (samuelfloresc@gmail.com)
 * @author Jiří Černý (jiri.cerny@ibt.cas.cz)
 */

import { FileRequest } from './file-request';
import { ResponseDeserializers } from './response-deserializers';
import { Query as Q } from './query';

export namespace FileQuery {
    export function finishUpload(jobId: string, transferId: string) {
        return Q.query(() => FileRequest.finishUpload(jobId, transferId), ResponseDeserializers.toEmpty, 'Cannot finish file transfer');
    }

    export function initUpload(jobId: string, fileName: string) {
        return Q.query(() => FileRequest.initUpload(jobId, fileName), ResponseDeserializers.toFileTransferInfo, 'Cannot initiate file upload');
    }

    export function uploadChunk(jobId: string, transferId: string, data: Uint8Array) {
        return Q.query(() => FileRequest.uploadChunk(jobId, transferId, data), ResponseDeserializers.toEmpty, 'Cannot upload file chunk');
    }

    export function uploadChunkUint8(jobId: Uint8Array, transferId: Uint8Array, data: Uint8Array) {
        return Q.query(() => FileRequest.uploadChunkUint8(jobId, transferId, data), ResponseDeserializers.toEmpty, 'Cannot upload file chunk');
    }
}
