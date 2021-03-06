/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const Event = require('./models/event');
const Rsvp = require('./models/rsvp');


/*
 |--------------------------------------
 | Authentication Middleware
 |--------------------------------------
 */

module.exports = function(app,config){
  // Authentication middleware
  const jwtCheck = jwt({
      secret : jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri:  `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
      }),
      aud: config.AUTH0_API_AUDIENCE,
      issuer: `https://${config.AUTH0_DOMAIN}/`,
      algorithm: 'RS256',
  });

  //check for authenticated admin user
  const adminCheck = (req, res, next) => {
      const roles = req.user[config.NAMESPACE] || [];
      if (roles.indexOf('admin') > -1) {
          next();
      } else {
          res.status(401).send({message: 'Not authorized for admin access'});
      }
  }
/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */
const _eventListProjection = 'title startDateTime endDateTime viewPublic';

//get all public events in the future
app.get('/api/events', (req,res) =>{
    Event.find({viewPublic: true, startDateTime: {$gte: new Date()}}, _eventListProjection, (err, events) => {
        let eventsArr = [];
        if (err) {
            return res.status(500).send({message: err.message});
        }
        if (events){
            events.forEach(event => {
                eventsArr.push(event);
            });
        }
        res.send(eventsArr);
    });
});

//get all events, public and private, past and future, admin only
app.get('/api/events/admin', jwtCheck, adminCheck, (req,res) => {
    Event.find({}, _eventListProjection, (err,events) =>{
        let eventsArr = [];
        if (err) {
            return res.status(500).send({message: err.message});
        }
        if (events){
            events.forEach(event =>{
                eventsArr.push(event);
            });
        }
        res.send(eventsArr);
    });
});

//get event by event ID
app.get('/api/event/:id', jwtCheck, (req, res) => {
    Event.findById(req.params.id, (err, event) =>{
        if(err) {
            return  res.status(500).send({message: err.message});
        }
        if (!event) {
            return res.status(400).send({message: 'Event not found.'});
        }
        res.send(event);
    });
});

//get RSVPs by event ID
app.get('/api/event/:eventId/rsvps', jwtCheck, (req, res) => {
    Rsvp.find({eventId: req.params.eventId}, (err, rsvps) => {
        let rsvpsArr = [];
        if (err) {
            return res.status(500).send({message: err.message});
        }
        if (rsvps) {
            rsvps.forEach(rsvp => {
                rsvpsArr.push(rsvp);
            })
        }
        res.send(rsvpsArr);
    });
});

// new RSVP
    app.post('/api/rsvp/new', jwtCheck, (req, res) =>{
        Rsvp.findOne({eventId: req.body.eventId, userId: req.body.userId}, (err, existingRsvp) =>{
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (existingRsvp) {
                return res.status(409).send({messaage: 'You have already RSVPed to this event.'});
            }
            const rsvp = new Rsvp({
                userId: req.body.userId,
                name: req.body.name,
                eventId: req.body.eventId,
                attending: req.body.attending,
                guests: req.body.guests,
                comments: req.body.comments
            });
            rsvp.save((err) =>{
                if (err) {
                    return res.status(500).send({message: err.message});
                }
                res.send(rsvp);
            });
        });
    });

    // edit an existing RSVP
    app.put('/api/rsvp/:id', jwtCheck, (req, res) => {
        Rsvp.findById(req.params.id, (err, rsvp) => {
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (!rsvp) {
                return res.status(400).send({message: 'RSVP not found.'});
            }
            if (rsvp.userId !== req.user.sub) {
                return res.status(401).send({message: 'You cannot edit someone else\'s RSVP.'});
            }
            rsvp.name = req.body.name;
            rsvp.attending = req.body.attending;
            rsvp.guests = req.body.guests;
            rsvp.comments = req.body.comments;

            rsvp.save(err => {
                if (err) {
                    return res.status(500).send({message: err.message});
                }
                res.send(rsvp);
            });
        });
    });

  // GET API root
  app.get('/api/', (req,res) => {
      res.send('API works');
  });
};
