import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from'body-parser';

const app = express();
const port = 8080;

app.use(cors())
app.use(bodyParser.json())

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp/'
}))

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  console.log(file)

  file.mv(`./assets/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    console.log('Success!');
    res.send({});
  })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
