//jshint esversion:6
//require
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/journalDB', {
    useNewUrlParser: true
});
const app = new express();

//create Schema 
const journalSchema = {
    title: {
        type: String,
        required: true
    },
    body: String
};
//create journal model 
const journalModel = mongoose.model("journal", journalSchema);

//a global variable that will store user blog title and text inside an arary
let someVal = "";
//sample texts
const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const contactContent = "Please contact to tengis0621@gmail.com";
const aboutContent = "This is a simple note";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    journalModel.find({}, (err, docs) => {
        docs.forEach(document => {
            console.log(document.title);
        });
        res.render('home', {
            homeContent: homeStartingContent,
            postTextEJS: docs
        });
    });
});

app.get('/about', function (req, res) {
    res.render("about", {
        about: aboutContent
    });
});

app.get('/contact', function (req, res) {
    res.render("contact", {
        contact: contactContent
    });
});

app.get('/compose', function (req, res) {
    res.render("compose");
});

app.post('/compose', function (req, res) {
    let journalTitle = req.body.textTitle;
    let journalBody = req.body.textBody;
    //create an object
    const tempJournal = new journalModel({
        title: journalTitle,
        body: journalBody
    });
    tempJournal.save((err) => {
        if (!err) {
            console.log("post saved successful");
            res.redirect('/');
        }
    });
});

app.get('/posts/:postKey', function (req, res) {
    //get name of the title 
    const requestedTitle = _.lowerCase(req.params.postKey);
    // loop through database to find requested title and render it to different link
    journalModel.find({}, (err, post) => {
        post.forEach((docs) => {
            const storedTitle = _.lowerCase(docs.title);
            if (storedTitle === requestedTitle) {
                res.render("post", {
                    postTitleEJS: docs.title,
                    postParagraphEJS: docs.body
                });
                return;
            }
        });
    });
});


// app.post('/', function(req, res){
//     res.redirect('/'); 
// });

//listen port
app.listen(3000, () => {
    console.log("Your server is running in port 3000");
});