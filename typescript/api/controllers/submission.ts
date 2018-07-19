import { SubmissionModel, ISubmission } from '../models/submission';

class Submission {
	public post(req, res, next) {
		//implement logic to save to mongoose here
		var submissionData = req.body;
		var submissionId;
		var dbFormPageStep ;
		if (!submissionData.submissionId) {
			submissionId = generateRandomCode();
		} else {
			submissionId = submissionData.submissionId
		}

		SubmissionModel.findOne({ submissionId: submissionId }, function (err, submission) {
			if (err) {
				res.json({ status: 201, message: err });
			} else {
				if (submission) {
					var dbFormData = submission.value;
					var dbFormpageCompleted = submission.pageCompleted;
					for (var submissionKey in submissionData.submission) {
						for (var DBkey in dbFormData) {
							if (submissionKey == DBkey) {
								dbFormData[DBkey] = submissionData.submission[submissionKey];
							} else {
								dbFormData[submissionKey] = submissionData.submission[submissionKey];
							}
						}
					}

					var pageStep = 0;
					dbFormpageCompleted.forEach(element => {
						if (submissionData.step == element.pageNo) {
							pageStep++;
						}
					});
					
					
					if (pageStep == 0) {
						dbFormpageCompleted.push({pageNo : submissionData.step, pageTitle: submissionData.pageTitle });
					}

					var VaRecord = {
						submissionId: submissionId,
						value: dbFormData,
						pageCompleted: dbFormpageCompleted
					}

					SubmissionModel.update(
						{ submissionId: submissionId },
						VaRecord,
						{
							upsert: true
						}, function (err, results: ISubmission) {
							if (err) {
								res.json({ error: err });
							} else {
								res.json({ statusCode: 200, message: "Submission object saved succssfully", data: submissionData.submission, SubmissionId: submissionId })
							}
						}
					)

				} else {
					dbFormPageStep = {pageNo : submissionData.step, pageTitle: submissionData.pageTitle };
					var VaRecord = {
						submissionId: submissionId,
						value: submissionData.submission,
						pageCompleted: dbFormPageStep
					}

					SubmissionModel.update(
						{ submissionId: submissionId },
						VaRecord,
						{
							upsert: true
						}, function (err, results: ISubmission) {
							if (err) {
								res.json({ error: err });
							} else {
								res.json({ statusCode: 200, message: "Submission object saved succssfully", data: submissionData.submission, SubmissionId: submissionId })
							}
						}
					)
				}
			}
		});

		function generateRandomCode() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for (var i = 0; i < 10; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		}
	}

	public get(req, res, next) {
		//implement logic to save to mongoose here
		//var VASubmissionModel = new VaSubmissionModel();
		console.log(req.query);
		var submissionId = req.query.id;

		SubmissionModel.findOne({ submissionId: submissionId }, function (err, submission) {
			if (err) {
				res.json({ status: 201, message: err });
			} else {
				console.log('submission==>', submission);
				res.json({ status: 200, message: "Submission object fetched succssfully", data: submission });
			}
		});
	}
}

const post = new Submission().post;
const get = new Submission().get;
export { post, get };