import database from '../models';

class PhotoService {
  static addPhoto(publickId, userId, link) {
    return database.photo.create({
      imageLink: link,
      publickId,
      authId: userId,
    });
  }
}
export default PhotoService;
