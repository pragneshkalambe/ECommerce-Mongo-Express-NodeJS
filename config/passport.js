// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const Customer = require("../models/customer"); // your customer model

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback"
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         const name = profile.displayName;

//         console.log(`email : ${email} , name : ${name}`);

//         let customer = await Customer.findOne({ email });

//         if (!customer) {
//           customer = await Customer.create({
//             name: name,
//             email: email,
//             isGoogleUser: true,
//             password: null, // since google login
//           });
//         }

//         return done(null, customer);
//       } catch (error) {
//         console.error("Google Auth Error:", error);
//         return done(error, null); // ✅ THIS is correct
//       }
//     }
//   )
// );

// // session store
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await Customer.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });
