[nsqd](http://nsq.io/components/nsqd.html)

Example netdata configuration for node.d/nsqd.conf. Copy this section to nsqd.conf and change name/ip.

```json
{
    "enable_autodetect": false,
    "update_every": 5,
    "servers": [
        {
            "name": "nsqd",
            "hostname": "localhost:4151",
            "update_every": 5,
            "api_path": "/stats?format=json"
        }
    ]
}
```

The output of /stats?format=json looks like this:
```json
{
    "health": "OK",
    "start_time": 1506523730,
    "topics": [
        {
            "backend_depth": 0,
            "channels": [
                {
                    "backend_depth": 0,
                    "channel_name": "did",
                    "clients": [
                        {
                            "client_id": "nsqworker_1",
                            "connect_ts": 1506523741,
                            "deflate": false,
                            "finish_count": 272536,
                            "hostname": "",
                            "in_flight_count": 0,
                            "message_count": 272536,
                            "ready_count": 10,
                            "remote_address": "172.18.0.7:32854",
                            "requeue_count": 0,
                            "sample_rate": 0,
                            "snappy": false,
                            "state": 3,
                            "tls": false,
                            "tls_cipher_suite": "",
                            "tls_negotiated_protocol": "",
                            "tls_negotiated_protocol_is_mutual": false,
                            "tls_version": "",
                            "user_agent": "nsqjs/0.8.4",
                            "version": "V2"
                        }
                    ],
                    "deferred_count": 0,
                    "depth": 0,
                    "e2e_processing_latency": {
                        "count": 0,
                        "percentiles": null
                    },
                    "in_flight_count": 0,
                    "message_count": 272536,
                    "paused": false,
                    "requeue_count": 0,
                    "timeout_count": 0
                },
                {
                    "backend_depth": 0,
                    "channel_name": "es",
                    "clients": [
                        {
                            "client_id": "nsqworker_1",
                            "connect_ts": 1506523741,
                            "deflate": false,
                            "finish_count": 272536,
                            "hostname": "",
                            "in_flight_count": 0,
                            "message_count": 272537,
                            "ready_count": 10,
                            "remote_address": "172.18.0.7:32856",
                            "requeue_count": 0,
                            "sample_rate": 0,
                            "snappy": false,
                            "state": 3,
                            "tls": false,
                            "tls_cipher_suite": "",
                            "tls_negotiated_protocol": "",
                            "tls_negotiated_protocol_is_mutual": false,
                            "tls_version": "",
                            "user_agent": "nsqjs/0.8.4",
                            "version": "V2"
                        }
                    ],
                    "deferred_count": 0,
                    "depth": 0,
                    "e2e_processing_latency": {
                        "count": 0,
                        "percentiles": null
                    },
                    "in_flight_count": 0,
                    "message_count": 272536,
                    "paused": false,
                    "requeue_count": 0,
                    "timeout_count": 1
                }
            ],
            "depth": 0,
            "e2e_processing_latency": {
                "count": 0,
                "percentiles": null
            },
            "message_count": 272536,
            "paused": false,
            "topic_name": "data"
        },
        {
            "backend_depth": 0,
            "channels": [
                {
                    "backend_depth": 0,
                    "channel_name": "manager",
                    "clients": [
                        {
                            "client_id": "nsqworker_1",
                            "connect_ts": 1506523741,
                            "deflate": false,
                            "finish_count": 30662,
                            "hostname": "",
                            "in_flight_count": 0,
                            "message_count": 30662,
                            "ready_count": 10,
                            "remote_address": "172.18.0.7:32858",
                            "requeue_count": 0,
                            "sample_rate": 0,
                            "snappy": false,
                            "state": 3,
                            "tls": false,
                            "tls_cipher_suite": "",
                            "tls_negotiated_protocol": "",
                            "tls_negotiated_protocol_is_mutual": false,
                            "tls_version": "",
                            "user_agent": "nsqjs/0.8.4",
                            "version": "V2"
                        }
                    ],
                    "deferred_count": 0,
                    "depth": 0,
                    "e2e_processing_latency": {
                        "count": 0,
                        "percentiles": null
                    },
                    "in_flight_count": 0,
                    "message_count": 30662,
                    "paused": false,
                    "requeue_count": 0,
                    "timeout_count": 0
                }
            ],
            "depth": 0,
            "e2e_processing_latency": {
                "count": 0,
                "percentiles": null
            },
            "message_count": 30662,
            "paused": false,
            "topic_name": "manager"
        },
        {
            "backend_depth": 0,
            "channels": [
                {
                    "backend_depth": 0,
                    "channel_name": "notification",
                    "clients": [
                        {
                            "client_id": "nsqworker_1",
                            "connect_ts": 1506523741,
                            "deflate": false,
                            "finish_count": 274395,
                            "hostname": "",
                            "in_flight_count": 0,
                            "message_count": 274395,
                            "ready_count": 10,
                            "remote_address": "172.18.0.7:32860",
                            "requeue_count": 0,
                            "sample_rate": 0,
                            "snappy": false,
                            "state": 3,
                            "tls": false,
                            "tls_cipher_suite": "",
                            "tls_negotiated_protocol": "",
                            "tls_negotiated_protocol_is_mutual": false,
                            "tls_version": "",
                            "user_agent": "nsqjs/0.8.4",
                            "version": "V2"
                        }
                    ],
                    "deferred_count": 0,
                    "depth": 0,
                    "e2e_processing_latency": {
                        "count": 0,
                        "percentiles": null
                    },
                    "in_flight_count": 0,
                    "message_count": 274395,
                    "paused": false,
                    "requeue_count": 0,
                    "timeout_count": 0
                }
            ],
            "depth": 0,
            "e2e_processing_latency": {
                "count": 0,
                "percentiles": null
            },
            "message_count": 274395,
            "paused": false,
            "topic_name": "notification"
        }
    ],
    "version": "1.0.0-compat"
}
```
