require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express(); 
var dns = require('dns')
var urlParse = require('url')
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());
app.use('/public', express.static(process.cwd() + '/public'));

mongoose.connect('mongodb+srv://juanelcol1:c4qwp2@cluster0.a47av.mongodb.net/cluster0?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})

const schema = new mongoose.Schema({url: "string"})
const Url = mongoose.model("Url", schema)

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function (req, res) {

  const bodyUrl = req.body.url

  const something = dns.lookup(urlParse.parse(bodyUrl).host, (error, address)=>{
    if(!address){
      res.json({error: "invalid url"})
    } else {
        const url = new Url({url: bodyUrl})
      
        url.save((err, data)=>{
          if(err){
            res.json({error: "erro ao gravar no banco de dados"})
          }else{
            res.json({original_url: data.url, 
            short_url: data.id})
          }
        })
      }
  })

})
 
app.get('/api/shorturl/:id', (req, res)=>{
  const id = req.params.id
  
  Url.findById(id, (err, data)=>{
    if(err){
      res.json({error: err})
    }else {
      res.redirect(data.url)
    }
  })

})




app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
})
