# multi-draw

Draw in your terminal with friends. Only local mDNS discovery is supported.
There is no limitation on cursors, it just depends on how many friends you can
get in one LAN 😌 [`tcell`](https://github.com/gdamore/tcell) is used for
drawing pixels. An ephemeral topic stream is used which does not persist
messages, e.g. when new participants join, they do not see what was previously
drawn.

### Terminal 1

```
go run main.go
```

### Terminal 2

```
go run main.go
```
