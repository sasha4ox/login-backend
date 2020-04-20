import database from '../models';

class PhotoService {
  static addPhoto(publickId, userId, link) {
    return database.photo.create({
      imageLink: link,
      publickId,
      authId: userId,
    });
  }

  static async addPhotoToAuth(id, photo) {
    const updatedInfo = await database.auth.update(
      { currentImage: photo },
      { where: { id: Number(id) } },
    );
    return updatedInfo;
  }
}
export default PhotoService;
