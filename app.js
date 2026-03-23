const express = require('express');
const path = require('path');
const helmet = require('helmet');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = 3000;

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const comments = [];

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const isDevelopment = app.get('env') === 'development';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: isDevelopment ? null : [],
      },
    },
  })
);

app.get('/', (req, res) => {
  res.render('index', { comments });
});

app.post('/comment', (req, res) => {
  const dirtyText = req.body.text;

  const cleanText = DOMPurify.sanitize(dirtyText, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });

  comments.push(cleanText);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});