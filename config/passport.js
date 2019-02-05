"use strict";

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var passport = require('passport');


exports.init = function () {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        if (email) {
            email = email.toLowerCase();
        }

        process.nextTick(function () {
            User.findOne({
                'email': email
            }, function (err, iUser) {
                if (err) {
                    done(err);
                }
                if (!iUser) {
                    done(null, false);
                }
                if (!iUser.validPassword(password)) {
                    done(null, false);
                } else {
                    done(null, iUser);
                }
            });
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        if (email) {
            email = email.toLowerCase();
        }
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({
                    'email': email
                }, function (err, iUser) {
                    if (err) {
                        done(err);
                    }
                    if (iUser) {
                        done(null, false);
                    } else {
                        var newUser = new User();
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.username = req.user.username;

                        newUser.save(function (err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            } else if (!req.user.email) {
                User.findOne({
                    'email': email
                }, function (err, iUser) {
                    if (err) {
                        done(err);
                    }
                    if (iUser) {
                        done(null, false);
                    } else {
                        var user = req.user;
                        user.email = email;
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
                done(null, req.user);
            }
        });
    }));
};