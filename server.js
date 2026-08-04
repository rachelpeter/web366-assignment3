require("./config/mongoose");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const port = 3000;
const bcrypt = require('bcryptjs');
const Users = require("./models/User");
const sequelize = require("./config/sequelize");
const Task = require("./models/Task");

const clientSessions = require("client-sessions");
// require

sequelize.sync().then(() => {
  console.log('Task table sync');
}).catch((error) => {
  console.log('error');
});

app.use(
  clientSessions({
    cookieName: 'session', // this is the object name that will be added to 'req'
    secret: process.env.SESSION_SECRET, // this should be a long un-guessable string.
    duration: 30 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
  })
);

app.use(express.urlencoded({ extended: true }));

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.get('/register', (req, res) => {
  res.render('register', { message: '' });
});

app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});

app.post('/login', (req, res) => {

Users.findOne({ username: req.body.userName })
  .exec()
  .then((user) => {
    if (!user) {
      res.render('login', {message: 'Incorrect Credentials'});
    } else {
      bcrypt.compare(req.body.password, user.password)
  .then ((result) => {
    if(result){
      req.session.user = {
        username: user.username,
        email: user.email,
        _id: user._id
      };
      res.redirect('/dashboard')
    } else {
      res.render('login', {message: 'Incorrect password'})
    }
  })
  .catch((error) => {
    res.render('login', { message: `There was an error:` });
  });
  }
})
  .catch((err) => {
    res.render('login', { message: `There was an error:` });
  });

});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/login");
});

app.get('/dashboard', ensureLogin, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});


app.get("/tasks", ensureLogin, (req, res) => {
    
  Task.findAll({
    where: {userId: req.session.user._id}
    }).then((tasks) => {
        res.render("tasks", { tasks: tasks });
    }).catch((err) => {
        console.log(err);
        
    });
});

 app.post("/tasks/add", ensureLogin, (req, res) => {

  Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      userId: req.session.user._id
    }).then(() => {
      res.redirect('/tasks');
    }).catch((err) => {
      console.log(err);
      res.render('taskAdd', {message: 'Please fill in all fields'})
    });
  });

 app.post("/tasks/edit/:id", ensureLogin, (req, res)=> {
  Task.update(
    {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
    },
    {
      where: { id: req.params.id }, 
    }
  ).then(() => {
    res.redirect('/tasks');
    }).catch((err) => {
      console.log(err);
      res.redirect('/tasks');
    });
});

app.post("/tasks/delete/:id", ensureLogin, (req, res) => {
  
  Task.destroy({
    where: { id: req.params.id }, 
  }).then(() => {
    res.redirect('/tasks');
    }).catch((err) => {
      console.log(err);
      res.redirect('/tasks');
    });
});

app.post("/tasks/status/:id", ensureLogin, (req, res) => {

  Task.update(
    {
      status: req.body.status,
    },
    {
      where: { id: req.params.id }, 
    }
  ).then(() => {
    res.redirect('/tasks');
    }).catch((err) => {
      console.log(err);
      res.redirect('/tasks');
    });
});


app.get('/tasks/add', ensureLogin, (req, res) => {
  res.render('taskAdd', { message: '' });
});

app.get('/tasks/edit/:id', ensureLogin, (req, res) =>{

  Task.findAll({
      where: {
        id: req.params.id,
      },
    }).then((task) => {
      res.render("task", { task: task[0] });
    }).catch((err) => {
      console.log(err);
    });
});

app.post('/register', (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      return new Users({
        username: req.body.userName,
        email: req.body.email,
        password: hash
      }).save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      res.render('register', { message: 'Registration failed, Please re-try.'}); 
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
