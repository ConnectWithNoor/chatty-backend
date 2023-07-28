import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

function uploads(
  file: string, //base64 encoded string,
  folderName: string, // upload image files to a specific folder
  public_id?: string, // set custom public id
  overwrite?: boolean, // overwrite exisitng file with same public id
  invalidate?: boolean // invalidate the exisiting file with same public id,
): Promise<UploadApiErrorResponse | UploadApiResponse | undefined> {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate,
        folder: folderName
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        // handling error case wherever upload method will be called
        if (error) resolve(error);

        resolve(result);
      }
    );
  });
}

export { uploads };
