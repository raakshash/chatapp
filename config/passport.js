"use strict";

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');


exports.init = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        if (username) {
            username = username.toLowerCase();
        }

        process.nextTick(function () {
            User.findOne({
                'username': username
            }, function (err, iUser) {
                if (err) {
                    return done(err);
                }
                if (!iUser) {
                    return done(null, false);
                }
                if (!iUser.validPassword(password)) {
                    return done(null, false);
                } else {
                    return done(null, iUser);
                }
            });
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        if (username) {
            username = username.toLowerCase();
        }
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({
                    'username': username
                }, function (err, iUser) {
                    if (err) {
                        return done(err);
                    }
                    if (iUser) {
                        return done(null, false);
                    } else {
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            } else if (!req.user.username) {
                User.findOne({
                    'username': username
                }, function (err, iUser) {
                    if (err) {
                        return done(err);
                    }
                    if (iUser) {
                        return done(null, false);
                    } else {
                        var user = req.user;
                        user.username = username;
                        user.password = user.generateHash(password);

                        user.save(function (err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, user);
                        });
                    }
                });
            }else{
                return done(null, req.user);
            }
        });
    }));
};