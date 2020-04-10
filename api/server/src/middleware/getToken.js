import _split from 'lodash/split';

export default function(request, respons, next) {
  const headerAuth = request.headers.authorization;
  if (headerAuth) {
    const token = _split(headerAuth, ' ')[1];
    request.token = token;
  }

  next();
}
