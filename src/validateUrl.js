const url = require('url');

const validateUrl = (req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`)
    .pathname;

  if (normalizedUrl.includes('//')) {
    res.statusCode = 404;
    res.end('there is no such file');

    return false;
  }

  if (normalizedUrl === '/file/' || normalizedUrl === '/file') {
    res.statusCode = 200;

    res.end(
      'Path should start with /file/. Correct path is: "/file/<FILE_NAME>".',
    );

    return;
  }

  if (!normalizedUrl.startsWith('/file/')) {
    res.statusCode = 400;
    res.end('Request should not contain traversal paths.');

    return;
  }

  const fileName = getNormalizedPathname(normalizedUrl) || 'index.html';
  const pathToFile = `./public/${fileName}`;

  return pathToFile;
};

function getNormalizedPathname(pathname) {
  return pathname.replace('/file', '').slice(1).trim();
}

module.exports = { validateUrl };
