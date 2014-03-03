/**!
 * koa-fresh - index.js
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

module.exports = function () {
  return function *fresh(next) {
    yield next;

    if (!this.body) {
      return;
    }

    // determine if it's cacheable
    var cache = 'GET' === this.method || 'HEAD' === this.method;
    if (cache) {
      cache = (this.status >= 200 && this.status < 300) || 304 === this.status;
    }

    // freshness
    if (cache && this.fresh) {
      this.status = 304;
    }

    // strip irrelevant headers
    if (304 === this.status || 204 === this.status) {
      this.response.remove('Content-Type');
      this.response.remove('Content-Length');
      this.body = '';
    }
  };
}
