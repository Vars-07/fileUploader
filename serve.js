const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

const app = express();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.static('dist'));

app.post('/api/upload', upload.array('file'), (req, res)=> {
    res.status(200).json({ success: true, message: 'File Successfully Uploaded!!' });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
