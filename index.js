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
    yield* next;

    if (!this.body || this.status === 304) {
      return;
    }

    // determine if it's cacheable
    var cache = 'GET' === this.method || 'HEAD' === this.method;
    if (cache) {
      cache = this.status >= 200 && this.status < 300;
    }

    // freshness
    if (cache && this.fresh) {
      this.status = 304;
      this.response.remove('Content-Type');
      this.response.remove('Content-Length');
    }
  };
}
