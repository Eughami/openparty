const express = require('express')
const app = express()
const port = 7896
const firebase = require("firebase");

firebase.initializeApp({
  apiKey: "AIzaSyAqmmh2U3EF0D5H7cU_gtUDGua6J-pJmT8",
  authDomain: "openpaarty.firebaseapp.com",
  databaseURL: "https://openpaarty.firebaseio.com",
  projectId: "openpaarty",
  storageBucket: "openpaarty.appspot.com",
  messagingSenderId: "1068571012809",
  appId: "1:1068571012809:web:fe037ded9b36d40fdfe718",
  measurementId: "G-1GCM1NG8CM"
});

// const Post = {
//   user_id: string, //ID of the user owning the post
//   location?: Map<float, float> //Lat & Lng of the location of the post
//   likes: number,
//   age_rating?: IAgeRatingEnum,
//   image_url: string,
//   caption: string,
//   comments: Array<Comment>,
//   users_showing_up: number, //Indicating how many users would be showing up to this event,
//   date_of_post: Date,
//   date_of_event: Date,
// }
const posts = []

for (var i = 0; i < 10; i++) {
  posts.push({
    user_id: `userID${i}`, //ID of the user owning the post
    location: null, //Lat & Lng of the location of the post
    likes: i * 10,
    age_rating: null,
    image_url: 'https://i.pinimg.com/originals/ca/76/0b/ca760b70976b52578da88e06973af542.jpg',
    caption: 'Bring your cocaine and Pills',
    comments: [
      {
        user_id: `${i}`,
        comment: 'Ayo MF'
      },
      {
        user_id: `${i * 100}`,
        comment: 'Wassup Dog'
      },
      {
        user_id: `${i * 1000}`,
        comment: '69'
      },
    ],
    users_showing_up: i * 50, //Indicating how many users would be showing up to this event,
    date_of_post: new Date(2020, 9, i),
    date_of_event: new Date(1995, 9, i + 10),
    user: {
      image_url: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5d546e2c-9b74-474a-b611-52ca190f519c/dbell1k-30511769-cfe3-4f6a-bdac-fdef21cfa415.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNWQ1NDZlMmMtOWI3NC00NzRhLWI2MTEtNTJjYTE5MGY1MTljXC9kYmVsbDFrLTMwNTExNzY5LWNmZTMtNGY2YS1iZGFjLWZkZWYyMWNmYTQxNS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.8cv8qZPs0Ojw_gfzK6shb2JIl6JkQhMgixKVwC57Cy4',
      username: `MF number ${i}`,
    }
  })
}

// firebase.database().ref("Posts").set(posts);


// var users = []
// for(var i =0 ; i< 10; i++){
//   users.push({
//     image_url: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5d546e2c-9b74-474a-b611-52ca190f519c/dbell1k-30511769-cfe3-4f6a-bdac-fdef21cfa415.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNWQ1NDZlMmMtOWI3NC00NzRhLWI2MTEtNTJjYTE5MGY1MTljXC9kYmVsbDFrLTMwNTExNzY5LWNmZTMtNGY2YS1iZGFjLWZkZWYyMWNmYTQxNS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.8cv8qZPs0Ojw_gfzK6shb2JIl6JkQhMgixKVwC57Cy4',
//     username: `MF number ${i}`,
//     // following: number,
//     // followers: number,
//     // phone_numbers: Array<string>
//   })
// }

app.get('/', (req, res) => {
  res.send(posts)
})
// app.get('/users', (req, res)=>{
//   res.send(users)
// })

app.listen(port, () => {
  console.log(`Listening on Port ${port}`)
})