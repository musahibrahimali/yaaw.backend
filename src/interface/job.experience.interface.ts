import {Document} from "mongoose"; 

interface IJobExperience extends Document {
    readonly _id: string;
    readonly company: string;
    readonly position: string;
    readonly description: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly isCurrent: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export default IJobExperience;
 