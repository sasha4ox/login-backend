import PhotoService from '../services/PhotoService';
import Util from '../utils/Utils';
import photo from '../utils/photo';

const util = new Util();
class PhotoController {
  static upload(request, response) {
    // console.log('USER:', request.userData);
    const { id } = request.userData;
    if (!request.files) {
      util.setError(400, 'Something wrong with your image');
      return util.send(response);
    }
    const { tempFilePath } = request.files.image;
    photo(tempFilePath, 'upload', async (erorr, data) => {
      console.log('ANSWER FROM CLOUDINARY', erorr);
      console.log('ANSWER FROM CLOUDINARY', data);
      const newPhoto = await PhotoService.addPhoto(
        data.public_id,
        id,
        data.url,
      );
      if (!newPhoto) {
        util.setError(500, 'something went wrong');
        return util.send(response);
      }
      util.setSuccess(201, 'Photo uploaded', newPhoto.dataValues);
      return util.send(response);
    });

    console.log(request.files);
  }
}
export default PhotoController;
