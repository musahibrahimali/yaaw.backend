import {Document} from 'mongoose';

interface IEducation extends Document {
    readonly _id: string;
    readonly school: string;
    readonly degree: string;
    readonly fieldOfStudy: string;
    readonly grade: string;
    readonly description: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly isCurrent: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export default IEducation;