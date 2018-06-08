'use strict'

// This program will connect to one or more nsqd servers
// to get their stats

// example configuration in netdata/conf.d/node.d/nsqd.conf.md

const netdata = require('netdata')

netdata.debug(`loaded  ${__filename} plugin`)

const nsqd = {
  name: 'nsqd',
  enable_autodetect: false,
  update_every: 5,
  base_priority: 60000,

  dimensions: {
    depth: {
      depth: 'depth',
      backendDepth: 'backend_depth'
    },
    inFlight: {
      inFlight: 'in_flight_count'
    },
    message: {
      message: 'message_count',
      deferred: 'deferred_count',
      requeue: 'requeue_count',
      timeout: 'timeout_count'
    },
    connection: {
      connection: 'connection'
    }
  },
  charts: {},

  createBasicDimension: function (id, name, divisor) {
    return {
      id: id,                                      // the unique id of the dimension
      name: name,                                  // the name of the dimension
      algorithm: netdata.chartAlgorithms.absolute, // the id of the netdata algorithm
      multiplier: 1,                               // the multiplier
      divisor: divisor,                            // the divisor
      hidden: false                                // is hidden (boolean)
    }
  },

  // Gets a depth chart. Will be created if not existing.
  getDepthChart: function (service, topic, channel) {
    var id = this.getChartId(service, topic, channel, 'depth')
    var chart = nsqd.charts[id]
    if (this.isDefined(chart)) return chart

    var dim = {}
    Object.keys(nsqd.dimensions.depth).forEach(dimension => {
      dim[nsqd.dimensions.depth[dimension]] = this.createBasicDimension(nsqd.dimensions.depth[dimension], dimension, 1)
    })

    chart = {
      id: id,                                         // the unique id of the chart
      name: '',                                       // the unique name of the chart
      title: `${topic}/${channel} depth`,                   // the title of the chart
      units: 'messages',                              // the units of the chart dimensions
      family: topic,                                  // the family of the chart
      context: 'nsqd channel',                        // the context of the chart
      type: netdata.chartTypes.stacked,                  // the type of the chart
      priority: nsqd.base_priority + 1,               // the priority relative to others in the same family
      update_every: service.update_every,             // the expected update frequency of the chart
      dimensions: dim
    }
    chart = service.chart(id, chart)
    nsqd.charts[id] = chart

    return chart
  },
  // Gets a in-flight chart. Will be created if not existing.
  getInFlightChart: function (service, topic, channel) {
    var id = this.getChartId(service, topic, channel, 'inflight')
    var chart = nsqd.charts[id]
    if (this.isDefined(chart)) return chart

    var dim = {}
    Object.keys(nsqd.dimensions.inFlight).forEach(dimension => {
      dim[nsqd.dimensions.inFlight[dimension]] = this.createBasicDimension(nsqd.dimensions.inFlight[dimension], dimension, 1)
    })

    chart = {
      id: id,                                         // the unique id of the chart
      name: '',                                       // the unique name of the chart
      title: `${topic}/${channel} in-flight`,         // the title of the chart
      units: 'messages',                              // the units of the chart dimensions
      family: topic,                                  // the family of the chart
      context: 'nsqd channel',                        // the context of the chart
      type: netdata.chartTypes.area,                  // the type of the chart
      priority: nsqd.base_priority + 1,               // the priority relative to others in the same family
      update_every: service.update_every,             // the expected update frequency of the chart
      dimensions: dim
    }
    chart = service.chart(id, chart)
    nsqd.charts[id] = chart

    return chart
  },
  // Gets a message chart. Will be created if not existing.
  getMessageChart: function (service, topic, channel) {
    var id = this.getChartId(service, topic, channel, 'message')
    var chart = nsqd.charts[id]
    if (this.isDefined(chart)) return chart

    var dim = {}
    Object.keys(nsqd.dimensions.message).forEach(dimension => {
      dim[nsqd.dimensions.message[dimension]] = this.createBasicDimension(nsqd.dimensions.message[dimension], dimension, 1)
    })

    chart = {
      id: id,                                         // the unique id of the chart
      name: '',                                       // the unique name of the chart
      title: `${topic}/${channel} messages`,          // the title of the chart
      units: 'messages',                              // the units of the chart dimensions
      family: topic,                                  // the family of the chart
      context: 'nsqd channel',                        // the context of the chart
      type: netdata.chartTypes.stacked,               // the type of the chart
      priority: nsqd.base_priority + 1,               // the priority relative to others in the same family
      update_every: service.update_every,             // the expected update frequency of the chart
      dimensions: dim
    }
    chart = service.chart(id, chart)
    nsqd.charts[id] = chart

    return chart
  },
  // Gets a channel connection chart. Will be created if not existing.
  getConnectionChart: function (service, topic, channel) {
    var id = this.getChartId(service, topic, channel, 'connection')
    var chart = nsqd.charts[id]
    if (this.isDefined(chart)) return chart

    var dim = {}
    Object.keys(nsqd.dimensions.connection).forEach(dimension => {
      dim[nsqd.dimensions.connection[dimension]] = this.createBasicDimension(nsqd.dimensions.connection[dimension], dimension, 1)
    })

    chart = {
      id: id,                                         // the unique id of the chart
      name: '',                                       // the unique name of the chart
      title: `${topic}/${channel} connections`,       // the title of the chart
      units: 'connections',                           // the units of the chart dimensions
      family: topic,                                  // the family of the chart
      context: 'nsqd channel',                        // the context of the chart
      type: netdata.chartTypes.line,                  // the type of the chart
      priority: nsqd.base_priority + 1,               // the priority relative to others in the same family
      update_every: service.update_every,             // the expected update frequency of the chart
      dimensions: dim
    }
    chart = service.chart(id, chart)
    nsqd.charts[id] = chart

    return chart
  },

  processResponse: function (service, content) {
    const stats = nsqd.convertToJson(content)
    if (stats === null) return

    // add the service
    service.commit()

    const charts = nsqd.parseCharts(service, stats)
    charts.forEach(chart => {
      service.begin(chart.chart)
      chart.dimensions.forEach(dimension => {
        service.set(dimension.name, dimension.value)
      })
      service.end()
    })
  },

  parseCharts: function (service, stats) {
    const charts = []
    stats.topics.forEach(topic => {
      topic.channels.forEach(channel => {
        charts.push(this.parseMessageChart(service, topic.topic_name, channel.channel_name, channel))
        charts.push(this.parseDepthChart(service, topic.topic_name, channel.channel_name, channel))
        charts.push(this.parseInFlightChart(service, topic.topic_name, channel.channel_name, channel))
        charts.push(this.parseConnectionChart(service, topic.topic_name, channel.channel_name, channel))
      })
    })
    return charts
  },

  parseMessageChart: function (service, topicName, channelName, channelStats) {
    return this.getChart(this.getMessageChart(service, topicName, channelName),
      Object.keys(nsqd.dimensions.message).map(dimension => this.getDimension(nsqd.dimensions.message[dimension], channelStats[nsqd.dimensions.message[dimension]]))
    )
  },
  parseDepthChart: function (service, topicName, channelName, channelStats) {
    return this.getChart(this.getDepthChart(service, topicName, channelName),
      Object.keys(nsqd.dimensions.depth).map(dimension => this.getDimension(nsqd.dimensions.depth[dimension], channelStats[nsqd.dimensions.depth[dimension]]))
    )
  },
  parseInFlightChart: function (service, topicName, channelName, channelStats) {
    return this.getChart(this.getInFlightChart(service, topicName, channelName),
      Object.keys(nsqd.dimensions.inFlight).map(dimension => this.getDimension(nsqd.dimensions.inFlight[dimension], channelStats[nsqd.dimensions.inFlight[dimension]]))
    )
  },
  parseConnectionChart: function (service, topicName, channelName, channelStats) {
    return this.getChart(this.getConnectionChart(service, topicName, channelName),
      Object.keys(nsqd.dimensions.connection).map(dimension => this.getDimension(nsqd.dimensions.connection[dimension], channelStats.clients.length))
    )
  },

  getDimension: function (name, value) {
    return { name, value }
  },

  getChart: function (chart, dimensions) {
    return { chart, dimensions }
  },

  getChartId: function (service, topic, channel, type) {
    return `${service.name}.${topic}.${channel}.${type}`
  },

  convertToJson: function (content) {
    if (content === null) return null
    var json = content
    // can't parse if it's already a json object,
    // the check enables easier testing if the content is already valid JSON.
    if (typeof content !== 'object') {
      try {
        json = JSON.parse(content)
      } catch (error) {
        netdata.error(`nsqd: Got a response, but it is not valid JSON. Ignoring. Error: ${error.message}`)
        return null
      }
    }
    return this.isResponseValid(json) ? json : null
  },

  // some basic validation
  isResponseValid: function (json) {
    if (this.isUndefined(json.topics)) return false
    return this.isDefined(json.version)
  },

  // module.serviceExecute()
  // this function is called only from this module
  // its purpose is to prepare the request and call
  // netdata.serviceExecute()
  serviceExecute: function (name, uri, updateEvery) {
    netdata.debug(`${this.name}: ${name}: url: ${uri}, update_every: ${updateEvery}`)

    const service = netdata.service({
      name: `nsqd.${name}`,
      request: netdata.requestFromURL(`http://${uri}`),
      update_every: updateEvery,
      module: this
    })
    service.execute(this.processResponse)
  },

  configure: function (config) {
    if (this.isUndefined(config.servers)) return 0
    var added = 0
    config.servers.forEach(server => {
      if (this.isUndefined(server.update_every)) server.update_every = this.update_every
      if (this.areUndefined([server.name, server.hostname, server.api_path])) {} else {
        var url = server.hostname + server.api_path
        this.serviceExecute(server.name, url, server.update_every)
        added++
      }
    })
    return added
  },

  // module.update()
  // this is called repeatedly to collect data, by calling
  // netdata.serviceExecute()
  update: function (service, callback) {
    service.execute(function (serv, data) {
      service.module.processResponse(serv, data)
      callback()
    })
  },

  isUndefined: function (value) {
    return typeof value === 'undefined'
  },

  areUndefined: function (values) {
    return values.find(value => this.isUndefined(value))
  },

  isDefined: function (value) {
    return typeof value !== 'undefined'
  }
}

module.exports = nsqd
