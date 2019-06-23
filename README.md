# NATS Lab

[![XO code style][xo-img]][xo]

[xo-img]:              https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:                  https://github.com/sindresorhus/xo


Just an experiment with:

- NATS Stream
- API
- Threads (Worker)


## Usage

**Warning**

The instructions below it's for who is using Docker + Docker Compose.

To start the stack:

```
$ bin/start -b -d
```

To stop the stack:

```
$ bin/stop
```

---

It's possible run with `docker stack deploy`, but first is necessary generate the `docker-compose.yml` and `images`.

```
$ bin/gen
$ bin/image
$ docker stack deploy --prune --compose-file docker-compose.yml lab
```

Now, open the logs (each one in new shell) to know what is going on.

```
$ docker service logs -f lab_api
$ docker service logs -f lab_worker
```

And make a call in the API, for example:

```
$ curl 'http://[::1]:8080/pub/some_data'
$ curl 'http://[::1]:8080/pub/another_data'
$ curl 'http://[::1]:8080/pub/more_data'
```


## Team

[<img src="https://avatars.githubusercontent.com/u/130963?s=390" alt="Lagden" width="90">](https://10.0.1.202/lagden)


## License

MIT © [Thiago Lagden](http://lagden.in)
