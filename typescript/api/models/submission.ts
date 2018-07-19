import * as mongoose from 'mongoose';

export interface ISubmission extends mongoose.Document {
	// model here
	_id: string, // Mongo ObjectId
	submissionId: string, //unique form submit id
	value: {}, // multi step form field value in mixed schema 
	pageCompleted: [{
		pageNo: Number,
		pageTitle: String
	}]
	//etc
}

const schema = new mongoose.Schema({
	// schema model should match Document model
	submissionId: { type: String },//unique form submit id
	value: {},// multi step form field value in mixed schema 
	pageCompleted: [{
		pageNo: Number,
		pageTitle: String
	}]
	//etc
})

const SubmissionModel = mongoose.model<ISubmission>("submission", schema);
export { SubmissionModel };