/**
 * Copyright (c) 2020-2021 WebMMB contributors, licensed under MIT, See LICENSE file for details.
 *
 * @author Michal Malý (michal.maly@ibt.cas.cz)
 * @author Samuel C. Flores (samuelfloresc@gmail.com)
 * @author Jiří Černý (jiri.cerny@ibt.cas.cz)
 */

export class AdditionalFile {
    public isUploaded: boolean;
    public readonly file: File|null;
    public readonly name: string;
    public readonly size: number;

    private constructor(file: File|null, name?: string, size?: number) {
        this.file = file;

        if (this.file) {
            this.name = this.file.name;
            this.size = this.file.size;
            this.isUploaded = false;
        } else {
            if (!name || !size)
                throw new Error('Invalid initialization of AdditionalFile');
            this.name = name;
            this.size = size;
            this.isUploaded = true;
        }
    }

    static fromFile(file: File) {
        return new AdditionalFile(file);
    }

    static fromInfo(name: string, size: number) {
        return new AdditionalFile(null, name, size);
    }
}
