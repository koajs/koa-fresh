/**!
 * koa-fresh - test/fresh.test.js
 *
 * Copyright(c) 2014
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var koa = require('koa');
var should = require('should');
var request = require('supertest');
var etag = require('koa-etag');
var fresh = require('../');

describe('fresh.test.js', function () {
  describe('when response status 50x', function () {
    it('should pass through', function (done) {
      var app = koa();
      app.use(fresh());
      app.use(etag())

      app.use(function *(next) {
        this.status = 500;
        this.body = {error: 'err'};
      });

      request(app.listen())
      .get('/')
      .expect({error: 'err'})
      .expect(500, done);
    });
  });

  describe('when response status 20x', function () {
    it('should GET request not etag return 200 and etag', function (done) {
      var app = koa();
      app.outputErrors = true;
      app.use(fresh());
      app.use(etag())

      app.use(function *(next) {
        this.status = 200;
        this.body = {hi: 'foo'};
      });

      request(app.listen())
      .get('/')
      .expect('etag', '"-2137833482"')
      .expect({hi: 'foo'})
      .expect(200, done);
    });

    it('should HEAD request not etag return 200 and etag', function (done) {
      var app = koa();
      app.outputErrors = true;
      app.use(fresh());
      app.use(etag())

      app.use(function *(next) {
        this.status = 200;
        this.body = {hi: 'foo'};
      });

      request(app.listen())
      .head('/')
      .expect('etag', '"-2137833482"')
      .expect({})
      .expect(200, done);
    });

    it('should POST request with etag return 200 and not etag', function (done) {
      var app = koa();
      app.outputErrors = true;
      app.use(fresh());
      app.use(etag())

      app.use(function *(next) {
        this.status = 201;
        this.body = {hi: 'foo'};
      });

      request(app.listen())
      .post('/')
      .set('If-None-Match', '"-2137833482"')
      .expect('etag', '"-2137833482"')
      .expect({hi: 'foo'})
      .expect(201, done);
    });

    it('should request with etag return 304', function (done) {
      var app = koa();
      app.outputErrors = true;
      app.use(fresh());
      app.use(etag())

      app.use(function *(next) {
        this.status = 200;
        this.body = {hi: 'foo'};
      });

      request(app.listen())
      .get('/')
      .set('If-None-Match', '"-2137833482"')
      .expect('etag', '"-2137833482"')
      .expect('')
      .expect(304, done);
    });

    it('should clean body when status 204', function (done) {
      var app = koa();
      app.outputErrors = true;
      app.use(fresh());
      app.use(etag())

      app.use(function *(next) {
        this.status = 204;
        this.body = {hi: 'foo'};
      });

      request(app.listen())
      .get('/')
      .expect('')
      .expect(204, done);
    });
  });

  describe('when response status 301 or 302', function () {
    it('should request with etag return source status', function (done) {
      var app = koa();
      app.outputErrors = true;
      app.use(fresh());
      app.use(etag())

      app.use(function *(next) {
        this.redirect('/foo');
      });

      request(app.listen())
      .get('/')
      .set('If-None-Match', '"-2137833482"')
      .expect('Redirecting to <a href="/foo">/foo</a>.')
      .expect(302, done);
    });
  });
});
