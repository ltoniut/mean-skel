const config = require('../../config').config(),
		aws = require('aws-sdk'),
		fs = require('fs');

aws.config.update({
	accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
	secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY
});

aws.config.region = config.aws.region;

function uploadFile(file, path, next) {
	try {
		const filePath = path + "/" + file.name;
		const body = fs.createReadStream(file.path);

		// Handle read stream error
		body.on('error', function (error){ next(error); });

		const s3obj = new aws.S3({params: {Bucket: config.aws.S3_BUCKET_NAME, Key: filePath}});
		s3obj.upload({Body: body, ContentType: file.mimetype}).
		  send(function (err, data) {
		  	if (err)
				next(err);
			else
				next(null, filePath);
		  });
	} catch (err) {
		next(err);
	}
}

function deleteFile(key, next) {
	try{
		const s3 = new aws.S3();
		const params = {
		  Bucket: config.aws.S3_BUCKET_NAME,
		  Key: key
		};

		s3.deleteObject(params, function (err, data) {
			next(err);
		});
	} catch (err) {
		next(err);
	}
}

exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;

