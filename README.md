# [NSQD](http://nsq.io/components/nsqd.html) netdata plugin

Simple nsqd netdata plugin that will add channel connection count/depth/messages metrics and inflight messages charts to an netdata instance.

## Installation

First add the configuration file:

`/etc/netdata/node.d/nsqd.conf`

you can find an example of it in `nsqd.conf.md`

Then copy the plugin file:

`/usr/libexec/netdata/node.d/nsqd.node.js`

at last, restart netdata:

`systemctl restart netdata`

do not forget to install [node js](https://nodejs.org/) before installing the plugin.