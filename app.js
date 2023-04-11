const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const prt = 1080
app.use(bodyParser.urlencoded({ extended: true }))
app.setMaxListeners(30);
app.set("views", __dirname + '/views')
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render("homepg.ejs");
}
)

app.get('/about',(req,res)=>{
    res.render('about.ejs');
})

app.listen(prt || process.env.PORT, () => {
    console.log(`App is running live on Port ${prt}`)
})