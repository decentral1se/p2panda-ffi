package main

import (
	"flag"
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"strings"

	tcell "github.com/gdamore/tcell/v3"
	"github.com/gdamore/tcell/v3/color"
	p2panda "github.com/p2panda/p2panda-ffi/go/p2panda_ffi"
	"github.com/p2panda/p2panda-ffi/go/p2panda_ffi/nodebuilder"
)

var (
	colors = map[int]color.Color{
		0:  color.LawnGreen,
		1:  color.LemonChiffon,
		2:  color.LightBlue,
		3:  color.LightCoral,
		4:  color.LightCyan,
		5:  color.LightGoldenrodYellow,
		6:  color.LightGray,
		7:  color.LightGreen,
		8:  color.LightPink,
		9:  color.LightSalmon,
		10: color.LightSeaGreen,
		11: color.LightSkyBlue,
		12: color.LightSlateGray,
		13: color.LightSteelBlue,
		14: color.LightYellow,
		15: color.LimeGreen,
		16: color.Linen,
	}
)

type peer struct {
	id             string
	cursorColorIdx int
	cursorPosX     int
	cursorPosY     int
	cursorStyle    tcell.Style
}

type ephemeralStreamHandler struct {
	peers  map[string]peer
	screen tcell.Screen
}

func (h ephemeralStreamHandler) OnMessage(e *p2panda.EphemeralMessage) {
	peerId := e.Author().ToHex()
	cursor := strings.Split(string(e.Body()), ":")

	cursorPosX, err := strconv.Atoi(cursor[0])
	if err != nil {
		h.screen.Fini()
		panic(err)
	}

	cursorPosY, err := strconv.Atoi(cursor[1])
	if err != nil {
		h.screen.Fini()
		panic(err)
	}

	cursorColorIdx, err := strconv.Atoi(cursor[2])
	if err != nil {
		h.screen.Fini()
		panic(err)
	}

	cursorColor := colors[cursorColorIdx]
	cursorStyle := tcell.StyleDefault.Foreground(cursorColor)

	p, ok := h.peers[peerId]
	if !ok {
		p = peer{id: peerId, cursorPosX: cursorPosX, cursorPosY: cursorPosY, cursorStyle: cursorStyle}
		h.peers[peerId] = p
	} else {
		p.cursorPosX = cursorPosX
		p.cursorPosY = cursorPosY
		h.peers[peerId] = p
	}

	h.screen.Put(p.cursorPosX, p.cursorPosY, string(tcell.RuneBlock), p.cursorStyle)
	h.screen.Show()
}

func main() {
	networkFlag := flag.String("network", "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2", "Network Id hex")
	topicFlag := flag.String("topic", "f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1", "Topic Id hex")
	flag.Parse()

	tcell.SetEncodingFallback(tcell.EncodingFallbackASCII)

	screen, err := tcell.NewScreen()
	if err != nil {
		panic(err)
	}
	defer screen.Fini()

	if err := screen.Init(); err != nil {
		panic(err)
	}

	node, err := nodebuilder.New(nodebuilder.WithNetworkId(*networkFlag))
	if err != nil {
		panic(err)
	}
	defer node.Destroy()

	topic, err := p2panda.TopicFromHex(*topicFlag)
	if err != nil {
		panic(err)
	}
	defer topic.Destroy()

	handler := ephemeralStreamHandler{
		peers:  make(map[string]peer),
		screen: screen,
	}
	ephemeralStream, err := node.EphemeralStream(topic, handler)
	if err != nil {
		panic(err)
	}
	defer ephemeralStream.Destroy()

	screen.EnableMouse()
	screen.Clear()

	cursorColorIdx := rand.Intn(len(colors) - 1)
	cursorColor := colors[cursorColorIdx]
	cursorStyle := tcell.StyleDefault.Foreground(cursorColor)

	for {
		screen.Show()

		select {
		case ev := <-screen.EventQ():
			switch ev := ev.(type) {
			case *tcell.EventResize:
				screen.Sync()
			case *tcell.EventKey:
				if ev.Key() == tcell.KeyEscape || ev.Key() == tcell.KeyCtrlC {
					screen.Fini()
					os.Exit(0)
				}
			case *tcell.EventMouse:
				cursorX, cursorY := ev.Position()

				switch ev.Buttons() {
				case tcell.ButtonPrimary:
					screen.Put(cursorX, cursorY, string(tcell.RuneBlock), cursorStyle)
					screen.Show()

					msg := []byte(fmt.Sprintf("%d:%d:%d", cursorX, cursorY, cursorColorIdx))
					if err := ephemeralStream.Publish(msg); err != nil {
						screen.Fini()
						panic(err)
					}
				}
			}
		}
	}

	screen.Fini()
}
