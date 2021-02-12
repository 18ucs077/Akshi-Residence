var mongoose = require('mongoose');
//var Villa = require('./models/Villa');
var Villa = require('./models/villa');
var Comment = require('./models/comment');

var data = [
  {
    name: "Cloud's Rest",
    image:
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixid=MXwxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtcHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'ohh hi there',
  },
  {
    name: 'Camp fire',
    image:
      'https://images.unsplash.com/photo-1531881503977-91282087e0c6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MzN8fGNhbXB8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'ohh hi there',
  },
  {
    name: 'Hilly camps',
    image:
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?ixid=MXwxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtcHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'ohh hi there',
  },
];

function seedDB() {
  Villa.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log('All villas have been removed');
    data.forEach(function (seed) {
      //add few villas
      Villa.create(seed, function (err, Villa) {
        if (err) {
          console.log('THERE IS AN ERROR');
        } else {
          console.log('ADDED A Villa');
          //adding comment
          Comment.create(
            {
              text: 'This place is great',
              author: 'homer',
            },
            function (err, comment) {
              if (err) {
                console.log(err);
              } else {
                Villa.comments.push(comment);
                Villa.save();
                console.log('CREATED NEW COMMENTS ');
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
