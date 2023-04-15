const axios = require("axios");
const bodyParser = require('body-parser');
const { Console } = require("console");
const express = require('express');
const { getPackedSettings } = require("http2");
const { builtinModules } = require('module')
const { cursorTo } = require('readline')
const app = express()
const prt = 1080
app.use(bodyParser.urlencoded({ extended: true }))
app.setMaxListeners(30);
app.set("views", __dirname + '/views')
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'))
let bmi = '';
let suggestionBMI = '';
let imgsrcBMI = '';
let errCodeBMI = '';
let currStateBMI = '';
let nameBMI = '';
let nameBMR = '';
let ageBMR = '';
let heightBMR = '';
let weightBMR = '';
let genderBMR = '';
let promptUSER = '';
let bmr = '';
let gptANS='';
app.get('/', (req, res) => {
    res.render("homepg.ejs", { stylesheet: '/styles.css' });
}
)

app.get('/about', (req, res) => {
    res.render('about.ejs', { stylesheet: '/styles.css' });
})

app.get('/meters', (req, res) => {
    res.render('meters.ejs', { stylesheet: '/stylesbmi.css' })
})

app.get('/bmi', (req, res) => {
    res.render('bmicalc.ejs', { stylesheet: '/stylesbmi.css' });
})

app.get('/bmiresult', (req, res) => {
    //learn about the chunk error:why only on passing the bmi it shows error?[FIND PATCH]
    res.render('bmiresult.ejs', { stylesheet: '/stylesbmi.css', name: nameBMI, bmi: bmi, suggestion: suggestionBMI, imgsrc: imgsrcBMI, currState: currStateBMI })
})

app.get('/bmr', (req, res) => {
    res.render('bmr.ejs', { stylesheet: '/stylesbmi.css' })
})

app.get('/gpt', (req, res) => {
    res.render('gpt.ejs', { stylesheet: '/styles.css' })
})

app.post('/gpt', async (req, res) => {
    console.log(req.body.prompt);
    promptUSER = req.body.prompt;

    const options = {
        method: 'POST',
        url: 'https://openai80.p.rapidapi.com/chat/completions',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '95992756cbmshdd903a59b07377ap1b3e73jsn36c4b8682a30',
            'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
        },
        data: { "model": "gpt-3.5-turbo", "messages": [{ "role": "user", "content": promptUSER }] }
    };

    await axios.request(options).then((response) => {
        console.log(response.data.choices[0].message.content);
        gptANS = response.data.choices[0].message.content;
    }).catch((error) => {
        console.error(error);
    });
    res.redirect('/gptans');
})

app.get('/gptans', (req, res) => {
    res.render('gptans.ejs', { stylesheet: '/styles.css', xyz: gptANS, q: promptUSER });
    // res.end('ok');
})

app.post('/bmicalc', (req, res) => {
    const weightBMI = Number(req.body.weight);
    const heightBMI = Number(req.body.height);
    nameBMI = req.body.name;
    console.log(weightBMI);
    console.log(heightBMI);
    bmi = (weightBMI) / (heightBMI * heightBMI);
    if (bmi < 18.5) {
        currStateBMI = 'Under Weight';
        suggestionBMI = `it's important to focus on gaining weight in a healthy way.

        Try to eat more nutrient-dense foods such as whole grains, fruits, vegetables, and lean proteins.
        Incorporate strength-training exercises into your fitness routine to build muscle mass.
        Consult with a healthcare professional or registered dietitian to develop a safe and effective plan for gaining weight.`
        imgsrcBMI = 'underweight.jpg'
    }
    else if (bmi >= 18.5 && bmi <= 24.9) {
        currStateBMI = 'Normally Weight';
        suggestionBMI = `If you are in the normal BMI range, it's important to maintain your weight by eating a balanced diet and staying physically active.
        Aim for a diet that includes a variety of nutrient-dense foods from all food groups.
        Try to engage in regular physical activity such as brisk walking, running, or cycling.
        Make sure to get enough sleep and manage stress levels, as these can impact weight and overall health.`
        imgsrcBMI = 'normal.jpg'
    }
    else if (bmi >= 25 && bmi <= 29.9) {
        currStateBMI = 'Over Weight'
        suggestionBMI = `If you are overweight, it's important to focus on losing weight in a healthy way to reduce the risk of obesity-related health problems.
        Try to eat a balanced diet that is low in calories, fat, and sugar.
        Engage in regular physical activity such as cardio exercises, strength-training exercises, or sports.
        Consult with a healthcare professional or registered dietitian to develop a safe and effective plan for weight loss.`
        imgsrcBMI = 'overweight.jpg'
    }
    else if (bmi >= 30) {
        currStateBMI = 'Obese'
        suggestionBMI = `If you are obese, it's important to take steps to lose weight in a safe and effective way to reduce the risk of obesity-related health problems.
        Try to eat a balanced diet that is low in calories, fat, and sugar.
        Engage in regular physical activity such as cardio exercises, strength-training exercises, or sports.
        Consider working with a healthcare professional or registered dietitian to develop a personalized plan for weight loss that may include medication or surgery`
        imgsrcBMI = 'obese.jpg'
    }
    else {
        return res.redirect('/error');
    }
    // console.log(bmi)
    res.redirect('/bmiresult');
})

app.post('/bmrDET', (req, res) => {
    ageBMR = req.body.age;
    nameBMR = req.body.name;
    weightBMR = req.body.weight;
    heightBMR = req.body.height;
    genderBMR = req.body.gender;
    //logic
    if (genderBMR === 'Male') {
        bmr = 88.362 + (13.397 * weightBMR) + (4.799 * heightBMR) - (5.677 * ageBMR)
        console.log(bmr);
        // Men: BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) – (5.677 x age in years)
    }
    else if (genderBMR === 'Female') {
        bmr = 447.593 + (9.247 * weightBMR) + (3.098 * heightBMR) - (4.330 * ageBMR)
        // Women: BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) – (4.330 x age in years)
    }
    res.redirect('/bmrRES')
})

app.get('/bmrRES', (req, res) => {
    res.render('bmrRES.ejs', { stylesheet: '/stylesbmi.css', name: nameBMR, bmr: bmr })
})

app.get('/blogs', (req, res) => {
    res.sendFile(__dirname + '/blog1.html');
})

app.get('/blog1', (req, res) => {
    res.sendFile(__dirname + '/blog1.html');
})

app.get('/:txt', (req, res) => {
    errCode = req.status;
    res.render('error.ejs', { err: errCode, stylesheet: '/stylesbmi.css' })
})

app.listen(prt || process.env.PORT, () => {
    console.log(`App is running live on Port ${prt}`)
})