const bodyParser = require('body-parser')
const express = require('express')
const { builtinModules } = require('module')
const { cursorTo } = require('readline')
const app = express()
const prt = 1080
app.use(bodyParser.urlencoded({ extended: true }))
app.setMaxListeners(30);
app.set("views", __dirname + '/views')
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'))
let bmi='';
let suggestion='';
let imgsrc='';
let errCode='';
let currState='';
let name='';
app.get('/', (req, res) => {
    res.render("homepg.ejs", { stylesheet: '/styles.css' });
}
)

app.get('/about', (req, res) => {
    res.render('about.ejs', { stylesheet: '/styles.css' });
})

app.get('/meters',(req,res)=>{
    res.render('meters.ejs',{stylesheet: '/stylesbmi.css'})
})

app.get('/bmi', (req, res) => {
    res.render('bmicalc.ejs', { stylesheet: '/stylesbmi.css' });
})

app.get('/bmiresult', (req, res) => {
let ts=bmi
console.log(ts);
//learn about the chunk error:why only on passing the bmi it shows error?[FIND PATCH]
res.render('bmiresult.ejs',{stylesheet:'/stylesbmi.css',name:name,bmi:bmi,suggestion:suggestion,imgsrc:imgsrc,currState:currState})
}) 

app.get('/bmr',(req,res)=>{
    res.render('bmr.ejs',{stylesheet:'/stylesbmi.css'})
})


app.post('/bmicalc', (req, res) => {
   const weight = Number(req.body.weight);
    const height = Number(req.body.height);
    name = req.body.name;
    bmi=(weight)/(height*height)
    if(bmi<18.5){
        currState='Under Weight';
        suggestion=`it's important to focus on gaining weight in a healthy way.

        Try to eat more nutrient-dense foods such as whole grains, fruits, vegetables, and lean proteins.
        Incorporate strength-training exercises into your fitness routine to build muscle mass.
        Consult with a healthcare professional or registered dietitian to develop a safe and effective plan for gaining weight.`
        imgsrc='underweight.jpg'
    }
    else if(bmi>=18.5&&bmi <=24.9){
        currState='Normally Weight';
        suggestion=`If you are in the normal BMI range, it's important to maintain your weight by eating a balanced diet and staying physically active.
        Aim for a diet that includes a variety of nutrient-dense foods from all food groups.
        Try to engage in regular physical activity such as brisk walking, running, or cycling.
        Make sure to get enough sleep and manage stress levels, as these can impact weight and overall health.`
        imgsrc='normal.jpg'
    }
    else if(bmi>=25&&bmi<=29.9){
        currState='Over Weight'
        suggestion=`If you are overweight, it's important to focus on losing weight in a healthy way to reduce the risk of obesity-related health problems.
        Try to eat a balanced diet that is low in calories, fat, and sugar.
        Engage in regular physical activity such as cardio exercises, strength-training exercises, or sports.
        Consult with a healthcare professional or registered dietitian to develop a safe and effective plan for weight loss.`
        imgsrc='overweight.jpg'
    }
    else if(bmi>=30){
        currState='Obese'
        suggestion=`If you are obese, it's important to take steps to lose weight in a safe and effective way to reduce the risk of obesity-related health problems.
        Try to eat a balanced diet that is low in calories, fat, and sugar.
        Engage in regular physical activity such as cardio exercises, strength-training exercises, or sports.
        Consider working with a healthcare professional or registered dietitian to develop a personalized plan for weight loss that may include medication or surgery`
        imgsrc='obese.jpg'
    }
    else{
        return res.redirect('/error');
    }
    // console.log(bmi)

    res.redirect('/bmiresult');
})

app.get('/:txt',(req,res)=>{
    errCode=req.status;
    res.render('error.ejs',{err:errCode,stylesheet:'stylesbmi.css'})
})

app.listen(prt || process.env.PORT, () => {
    console.log(`App is running live on Port ${prt}`)
})
